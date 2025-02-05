import { test, expect } from '@playwright/test';
test.use({ headless: true });
test('Menguji login dan mengambil cookie token', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const response = await page.request.post('http://localhost:4000/api/auth/login', {
        data: {
            email: 'abyalaxx@gmail.com',
            password: 'pass'
        }
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
    // Valid Credential
    await context.addCookies([
        {
            name: 'access_token',
            value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IkFieWEgQmFoYXJpIFdhZmR1bGxvaCBTIiwiZW1haWwiOiJhYnlhbGF4eEBnbWFpbC5jb20iLCJpYXQiOjE3Mzg3MjI1OTEsImV4cCI6MTczODgwODk5MX0.d0A8D4LLRvWxwnOOHdR1BCMbYP9fr25KHtL0FX7bjtY', 
            domain: 'localhost', 
            path: '/',
            httpOnly: true,
            secure: false
        }
    ]);
    const responseGet = await page.request.get('http://localhost:4000/api/profile/2');
    expect(responseGet.status()).toBe(200);
    console.log('✓ Success hit endpoint protected with valid token');
});

test('Menguji akses endpoint yang dilindungi dengan token yang salah', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await context.addCookies([
        {
            name: 'access_token',
            value: 'token_invalid..d0A8D4LLRvWxwnOOHdR1BCMbYP9fr25KHtL0FX7bjtY', 
            domain: 'localhost', 
            path: '/',
            httpOnly: true,
            secure: false
        }
    ]);
    const responseGet = await page.request.get('http://localhost:4000/api/profile/2');
    expect(responseGet.status()).toBe(401);
    console.log('✓ Success send response 401 UnauthorizedException when token invalid');
});




