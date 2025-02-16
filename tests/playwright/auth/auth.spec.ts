import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const PORT = process.env.PORT ?? '3000'
const loginCredential = {
    email: process.env.EMAIL ?? 'email_valid_email@gmail.com',
    password: process.env.PASSWORD ?? 'password_valid_password'
}
const validToken = process.env.VALID_TOKEN ?? 'ini_harus_token_yang_valid._ubah_env.test'
const invalidToken = 'token_invalid..d7bjtY'

test.use({ headless: true });
test('Menguji login dan mengambil cookie token', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const response = await page.request.post(`http://localhost:${PORT}/api/auth/login`, {
        data: loginCredential
    });
    expect(response.status()).toBe(200); 
    const cookies = await context.cookies();
    const tokenCookie = cookies.find(cookie => cookie.name === 'access_token');
    expect(tokenCookie).toBeDefined();
    console.log('✓ Success defined token cookie');
});

test('Menguji akses endpoint yang dilindungi dengan token yang valid', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await context.addCookies([
        {
            name: 'access_token',
            value: validToken, 
            domain: 'localhost', 
            path: '/',
            httpOnly: true,
            secure: false
        }
    ]);
    const responseGet = await page.request.get(`http://localhost:${PORT}/api/user/profile`);
    expect(responseGet.status()).toBe(200);
    console.log('✓ Success hit endpoint protected with valid token');
});

test('Menguji akses endpoint yang dilindungi dengan token yang salah', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await context.addCookies([
        {
            name: 'access_token',
            value: invalidToken, 
            domain: 'localhost', 
            path: '/',
            httpOnly: true,
            secure: false
        }
    ]);
    const responseGet = await page.request.get(`http://localhost:${PORT}/api/user/profile`);
    expect(responseGet.status()).toBe(401);
    console.log('✓ Success send response 401 UnauthorizedException when token invalid');
});




