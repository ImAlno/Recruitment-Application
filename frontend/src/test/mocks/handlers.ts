/**
 * MSW Network Handlers
 * This file defines the mock API endpoints used by our tests.
 * It intercepts real network requests and returns deterministic JSON responses.
 */
import { http, HttpResponse } from 'msw';

const baseURL = 'http://localhost:3000/api';

export const handlers = [
    /**
     * Authentication Endpoints
     */
    // Handles POST /api/auth/login
    http.post(`${baseURL}/auth/login`, async ({ request }) => {
        const { username, password } = (await request.json()) as any;

        if (username === 'testuser' && password === 'Password123!') {
            return HttpResponse.json({
                success: {
                    id: 1,
                    username: 'testuser',
                    email: 'test@example.com',
                    personNumber: '19900101-1234',
                    role: 'applicant',
                    firstName: 'Test',
                    lastName: 'User'
                }
            });
        }

        return new HttpResponse(null, { status: 401 });
    }),

    http.post(`${baseURL}/auth/register`, () => {
        return HttpResponse.json({ success: true }, { status: 201 });
    }),

    http.get(`${baseURL}/auth/availability`, ({ request }) => {
        const url = new URL(request.url);
        const username = url.searchParams.get('username');

        if (username === 'taken') {
            return HttpResponse.json({
                success: { usernameTaken: true, emailTaken: false }
            });
        }

        return HttpResponse.json({
            success: { usernameTaken: false, emailTaken: false }
        });
    }),

    http.post(`${baseURL}/auth/logout`, () => {
        return HttpResponse.json({ success: true }, { status: 200 });
    }),

    /**
     * Application Management Endpoints
     */
    // Handles POST /api/application/submit
    http.post(`${baseURL}/application/submit`, async ({ request }) => {
        const data = (await request.json()) as any;
        return HttpResponse.json({ success: { applicationId: 101, ...data } }, { status: 201 });
    }),

    http.get(`${baseURL}/admin/applications`, () => {
        return HttpResponse.json({
            success: [
                { applicationId: 1, status: 'unhandled', firstName: 'Test', lastName: 'User' },
                { applicationId: 2, status: 'accepted', firstName: 'Jane', lastName: 'Doe' }
            ]
        });
    }),

    http.get(`${baseURL}/admin/applications/:id`, ({ params }) => {
        const { id } = params;
        if (id === '999') {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json({
            success: { applicationId: Number(id), status: 'unhandled', firstName: 'Test', lastName: 'User' }
        });
    }),

    http.put(`${baseURL}/application/:id`, async ({ params, request }) => {
        const { id } = params;
        const { status } = (await request.json()) as any;
        return HttpResponse.json({
            success: { applicationId: Number(id), status }
        });
    }),
];
