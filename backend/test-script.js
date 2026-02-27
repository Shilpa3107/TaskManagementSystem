
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const email = `test_${Date.now()}@example.com`;
const password = 'password123';

async function test() {
    console.log('--- Starting API Tests ---');

    try {
        // 1. Register
        console.log('\n1. Testing /auth/register...');
        const regRes = await axios.post(`${BASE_URL}/auth/register`, { email, password });
        console.log('Success:', regRes.status, regRes.data);

        // 2. Login
        console.log('\n2. Testing /auth/login...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        const { accessToken, refreshToken } = loginRes.data;
        console.log('Success: Got tokens');

        const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } };

        // 3. Create Task
        console.log('\n3. Testing POST /tasks...');
        const taskRes = await axios.post(`${BASE_URL}/tasks`, {
            title: 'Test Task',
            description: 'Testing the API'
        }, authHeader);
        const taskId = taskRes.data.id;
        console.log('Success: Task created with ID:', taskId);

        // 4. Get Tasks (Pagination/Filter/Search)
        console.log('\n4. Testing GET /tasks (Pagination/Filter/Search)...');
        const tasksRes = await axios.get(`${BASE_URL}/tasks?search=Test&page=1&limit=10`, authHeader);
        console.log('Success: Tasks found:', tasksRes.data.tasks.length);
        console.log('Pagination info:', tasksRes.data.total, 'total tasks');

        // 5. Toggle Task
        console.log('\n5. Testing PATCH /tasks/:id/toggle...');
        const toggleRes = await axios.patch(`${BASE_URL}/tasks/${taskId}/toggle`, {}, authHeader);
        console.log('Success: New status:', toggleRes.data.status);

        // 6. Refresh Token
        console.log('\n6. Testing /auth/refresh...');
        const refreshRes = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        console.log('Success: Got new access token');

        // 7. Delete Task
        console.log('\n7. Testing DELETE /tasks/:id...');
        const deleteRes = await axios.delete(`${BASE_URL}/tasks/${taskId}`, authHeader);
        console.log('Success: Task deleted', deleteRes.status);

        // 8. Logout
        console.log('\n8. Testing /auth/logout...');
        const logoutRes = await axios.post(`${BASE_URL}/auth/logout`, {}, authHeader);
        console.log('Success:', logoutRes.status);

        console.log('\n--- All API Tests Passed! ---');
    } catch (error) {
        console.error('\n!!! Test Failed !!!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

test();
