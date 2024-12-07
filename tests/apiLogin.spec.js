import { expect, test } from '@playwright/test';
import { HttpStatusCode } from 'axios';
import Ajv from "ajv";

import { loginUserData, loginUserInvalidData } from '../data';
import { loginSchemaData, loginSchemaDataFailed } from '../schema/login.Schema';

const ajv = new Ajv()

test.describe('Authentication', () => {
    test('TC001 - Successful Login', async ({ request }) => {
        const response = await request.post(`/api/login`, {
            data: loginUserData
        });

        expect(response.status()).toBe(HttpStatusCode.Ok);
        expect(response.headers()['content-type']).toContain('application/json');

        const data = await response.json();
        const validate = ajv.compile(loginSchemaData);

        expect(validate(data)).toBe(true);
        expect(data).toHaveProperty('token');
        expect(data.token).toBeTruthy();
    });

    test('TC002 - Unsuccessful Login - Invalid Credentials', async ({ request }) => {

        const response = await request.post(`/api/login`, {
            data: loginUserInvalidData
        });

        expect(response.status()).toBe(HttpStatusCode.BadRequest);
        expect(response.headers()['content-type']).toContain('application/json');

        const data = await response.json();
        const validate = ajv.compile(loginSchemaDataFailed);

        expect(validate(data)).toBe(true);
        expect(data).toHaveProperty('error');
        expect(data.error).toBeTruthy();
    });
});