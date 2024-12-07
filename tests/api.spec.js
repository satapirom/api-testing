import { expect, test } from '@playwright/test';
import { HttpStatusCode } from 'axios';
import Ajv from "ajv";

import { UserSchemaData } from '../schema/getUserData.schema';
import { createUserSchemaData } from '../schema/createUser.schema';
import { updateUserSchemaData } from '../schema/updateUserData.schema';
import { createUserData, updateUserData } from '../data';

const ajv = new Ajv();

test.describe('User API Tests', () => {
    test('TC001 - Get single user data successfully', async ({ request }) => {

        const userId = 2;
        const response = await request.get(`/api/users/${userId}`);

        expect(response.status()).toBe(HttpStatusCode.Ok);
        expect(response.headers()['content-type']).toContain('application/json');

        const data = await response.json();
        const validate = ajv.compile(UserSchemaData);

        expect(validate(data)).toBe(true);
        expect(data.data.id).toBe(userId);
    });

    test('TC002 - Get non-existent user data', async ({ request }) => {
        const userId = 23;
        const response = await request.get(`/api/users/${userId}`);

        expect(response.status()).toBe(HttpStatusCode.NotFound);
        expect(response.headers()['content-type']).toContain('application/json');

        const data = await response.json();
        expect(Object.keys(data).length).toBe(0);
    });

    test('TC003 - Create user successfully', async ({ request }) => {
        const response = await request.post(`/api/users`, {
            data: createUserData
        });

        expect(response.status()).toBe(HttpStatusCode.Created);
        expect(response.headers()['content-type']).toContain('application/json');

        const data = await response.json();
        const validate = ajv.compile(createUserSchemaData);

        expect(validate(data)).toBe(true);
        expect(data).toEqual(expect.objectContaining(createUserData));
    });

    test('TC004 - Update user successfully', async ({ request }) => {
        const userId = 2;
        const response = await request.put(`/api/users/${userId}`, {
            data: updateUserData
        });

        expect(response.status()).toBe(HttpStatusCode.Ok);
        expect(response.headers()['content-type']).toContain('application/json');

        const data = await response.json();
        const validate = ajv.compile(updateUserSchemaData);

        expect(validate(data)).toBe(true);
        expect(data).toEqual(expect.objectContaining(updateUserData));
    });

    test('TC005 - Delete user successfully', async ({ request }) => {
        const userId = 2;
        const response = await request.delete(`/api/users/${userId}`);

        expect(response.status()).toBe(HttpStatusCode.NoContent);
    });
});