import { expect, test } from '@playwright/test';
import { HttpStatusCode } from 'axios';
import Ajv from "ajv";

import { UserSchemaData } from '../schema/getUserData.schema';
import { createUserSchemaData } from '../schema/createUser.schema';
import { updateUserSchemaData } from '../schema/updateUserData.schema';
import { createUserData, updateUserData } from '../data';

const ajv = new Ajv()

test.describe('GET', () => {
    test('TC001 - Get single user data ', async ({ request }) => {
        const response = await request.get(`/api/users/2`);

        expect(response.status()).toBe(HttpStatusCode.Ok);

        const header = response.headers()['content-type'];
        expect(header).toContain('application/json')

        const data = await response.json();
        const validate = ajv.compile(UserSchemaData);
        expect(validate(data)).toBe(true);
    });

    test('TC002 - Get single user data not found', async ({ request }) => {
        const response = await request.get(`/api/users/23`);

        expect(response.status()).toBe(HttpStatusCode.NotFound);

        const header = response.headers()['content-type'];
        expect(header).toContain('application/json')

        const data = await response.json();
        expect(Object.keys(data).length).toBe(0);
    });
});



test.describe('POST', () => {
    test('TC003 - Create user', async ({ request }) => {
        const response = await request.post(`/api/users`, {
            data: createUserData
        });

        expect(response.status()).toBe(HttpStatusCode.Created);

        const header = response.headers()['content-type'];
        expect(header).toContain('application/json')

        const data = await response.json();
        const validate = ajv.compile(createUserSchemaData);
        expect(validate(data)).toBe(true);

        // Corrected value check
        expect(data).toEqual(expect.objectContaining(createUserData));
    })
});

test.describe('PUT', () => {
    test('TC004 - Update user', async ({ request }) => {
        const response = await request.put('/api/users/2', {
            data: updateUserData
        });

        expect(response.status()).toBe(HttpStatusCode.Ok);

        const header = response.headers()['content-type'];
        expect(header).toContain('application/json')

        const data = await response.json();
        const validate = ajv.compile(updateUserSchemaData);
        expect(validate(data)).toBe(true);

        expect(data).toEqual(expect.objectContaining(updateUserData));
    });
});

test.describe('DELETE', () => {
    test('TC005 - Delete user', async ({ request }) => {
        const response = await request.delete('/api/users/2');

        expect(response.status()).toBe(HttpStatusCode.NoContent);
    })
});