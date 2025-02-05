import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { App } from 'supertest/types';
import * as request from 'supertest';

describe('Auth and Protected Route (E2E)', () => {
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should access protected route with JWT token from HTTP-only cookie', async () => {
        // Step 1: Login untuk mendapatkan token yang disimpan dalam HTTP-only cookie
        const loginResponse = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({ email: 'abyalaxx@gmail.com', password: 'pass' })
            .expect(200);

        // Ambil cookie dari respons login
        console.log('dari testing',loginResponse.headers['set-cookie']);

        const cookies = loginResponse.headers['set-cookie'];
        // Step 2: Gunakan cookie untuk mengakses endpoint yang dilindungi
        const protectedResponse = await request(app.getHttpServer(),)
            .get('/api/profile/2')
            .set('Cookie', cookies[0])
            .expect(200);
        console.log(protectedResponse);

        // Memastikan bahwa respons dari endpoint yang dilindungi sesuai
        expect(protectedResponse.body).toHaveProperty('data');
        // Bisa menambahkan pemeriksaan lebih lanjut tergantung data yang diharapkan
    });

});
