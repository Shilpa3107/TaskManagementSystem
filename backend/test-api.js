const BASE_URL = 'http://localhost:5000';

async function testBackend() {
    try {
        console.log('--- Starting Backend Verification ---');

        // 1. Register
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`1. Registering user: ${email}`);
        
        let res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.status !== 201) {
            const err = await res.json();
            throw new Error(`Registration failed: ${res.status} ${JSON.stringify(err)}`);
        }
        console.log('   ✅ Registration successful');

        // 2. Login
        console.log('2. Logging in');
        res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.status !== 200) {
            throw new Error(`Login failed: ${res.status}`);
        }
        const authData = await res.json();
        const token = authData.accessToken;
        if (!token) throw new Error('No access token received');
        console.log('   ✅ Login successful, token received');

        // 3. Create Task
        console.log('3. Creating Task');
        res = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: 'Test Task', description: 'This is a test' })
        });
        
        if (res.status !== 201) {
            throw new Error(`Create task failed: ${res.status}`);
        }
        const task = await res.json();
        console.log(`   ✅ Task created: ${task.id}`);

        // 4. Get Tasks
        console.log('4. Fetching Tasks');
        res = await fetch(`${BASE_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tasksData = await res.json();
        if (tasksData.tasks.length === 0 || tasksData.tasks[0].id !== task.id) {
            throw new Error('Task not found in list');
        }
        console.log('   ✅ Task found in list');

        // 5. Update Task
        console.log('5. Updating Task');
        res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: 'Updated Task Title' })
        });
        if (res.status !== 200) throw new Error('Update failed');
        const updatedTask = await res.json();
        if (updatedTask.title !== 'Updated Task Title') throw new Error('Task title did not update');
        console.log('   ✅ Task updated');

        // 6. Delete Task
        console.log('6. Deleting Task');
        res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status !== 204) throw new Error('Delete failed');
        console.log('   ✅ Task deleted');

        // 7. Verification
        res = await fetch(`${BASE_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const finalData = await res.json();
        if (finalData.tasks.length !== 0) throw new Error('Task list should be empty');
        console.log('   ✅ Task list is empty');

        console.log('--- Backend Verification Complete: SUCCESS ---');
    } catch (error) {
        console.error('❌ Backend Verification Failed:', error.message);
        process.exit(1);
    }
}

testBackend();
