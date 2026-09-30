const fs = require('fs');
const { JSDOM } = require('jsdom');

describe('Study Planner - File Tests', () => {

    test('index.html should exist', () => {
        expect(fs.existsSync('index.html')).toBe(true);
    });

    test('style.css should exist', () => {
        expect(fs.existsSync('style.css')).toBe(true);
    });

    test('script.js should exist', () => {
        expect(fs.existsSync('script.js')).toBe(true);
    });

    test('package.json should exist', () => {
        expect(fs.existsSync('package.json')).toBe(true);
    });

    test('build.js should exist', () => {
        expect(fs.existsSync('build.js')).toBe(true);
    });

    test('Dockerfile should exist', () => {
        expect(fs.existsSync('Dockerfile')).toBe(true);
    });

    test('deployment.yaml should exist', () => {
        expect(fs.existsSync('deployment.yaml')).toBe(true);
    });

    test('service.yaml should exist', () => {
        expect(fs.existsSync('service.yaml')).toBe(true);
    });
});


describe('Study Planner - Application Tests', () => {

    let dom;
    let window;
    let document;

    beforeEach(() => {

        const html = fs.readFileSync('index.html', 'utf8');

        dom = new JSDOM(html, {
            runScripts: 'dangerously',
            url: 'http://localhost'
        });

        window = dom.window;
        document = window.document;

        // Prevent JSDOM alert error
        window.alert = jest.fn();

        // Load actual application JavaScript
        const script = fs.readFileSync('script.js', 'utf8');

        const scriptElement = document.createElement('script');
        scriptElement.textContent = script;

        document.body.appendChild(scriptElement);
    });


    afterEach(() => {
        dom.window.close();
    });


    test('Application should start with no tasks', () => {

        expect(window.tasks).toEqual([]);
    });


    test('Required input fields should exist', () => {

        expect(document.getElementById('topic')).not.toBeNull();
        expect(document.getElementById('duration')).not.toBeNull();
        expect(document.getElementById('targetDate')).not.toBeNull();
        expect(document.getElementById('notes')).not.toBeNull();
    });


    test('Adding a valid task should create one task', () => {

        document.getElementById('topic').value =
            'Operating Systems';

        document.getElementById('duration').value =
            '2 hours';

        document.getElementById('targetDate').value =
            '2026-10-10';

        document.getElementById('notes').value =
            'Study processes';

        window.addTask();

        expect(window.tasks.length).toBe(1);

        expect(window.tasks[0].topic)
            .toBe('Operating Systems');

        expect(window.tasks[0].duration)
            .toBe('2 hours');

        expect(window.tasks[0].targetDate)
            .toBe('2026-10-10');

        expect(window.tasks[0].notes)
            .toBe('Study processes');

        expect(window.tasks[0].finished)
            .toBe(false);
    });


    test('Adding task without topic should fail', () => {

        document.getElementById('topic').value = '';

        document.getElementById('duration').value =
            '2 hours';

        document.getElementById('targetDate').value =
            '2026-10-10';

        window.addTask();

        expect(window.alert).toHaveBeenCalledWith(
            'Topic, duration, and target date are required.'
        );

        expect(window.tasks.length).toBe(0);
    });


    test('Adding task without duration should fail', () => {

        document.getElementById('topic').value =
            'Database Management System';

        document.getElementById('duration').value = '';

        document.getElementById('targetDate').value =
            '2026-10-10';

        window.addTask();

        expect(window.alert).toHaveBeenCalledWith(
            'Topic, duration, and target date are required.'
        );

        expect(window.tasks.length).toBe(0);
    });


    test('Adding task without target date should fail', () => {

        document.getElementById('topic').value =
            'Computer Networks';

        document.getElementById('duration').value =
            '3 hours';

        document.getElementById('targetDate').value = '';

        window.addTask();

        expect(window.alert).toHaveBeenCalledWith(
            'Topic, duration, and target date are required.'
        );

        expect(window.tasks.length).toBe(0);
    });


    test('Task should appear in the table after adding', () => {

        document.getElementById('topic').value =
            'Operating Systems';

        document.getElementById('duration').value =
            '2 hours';

        document.getElementById('targetDate').value =
            '2026-10-10';

        document.getElementById('notes').value =
            'Important topic';

        window.addTask();

        const rows =
            document.querySelectorAll('#tbody tr');

        expect(rows.length).toBe(1);

        expect(rows[0].textContent)
            .toContain('Operating Systems');

        expect(rows[0].textContent)
            .toContain('2 hours');

        expect(rows[0].textContent)
            .toContain('Important topic');
    });


    test('Delete task should remove the task', () => {

        document.getElementById('topic').value =
            'DBMS';

        document.getElementById('duration').value =
            '2 hours';

        document.getElementById('targetDate').value =
            '2026-10-15';

        window.addTask();

        expect(window.tasks.length).toBe(1);

        window.deleteTask(1);

        expect(window.tasks.length).toBe(0);

        expect(
            document.querySelectorAll('#tbody tr').length
        ).toBe(0);
    });


    test('Finish task should change status to Finished', () => {

        document.getElementById('topic').value =
            'Computer Networks';

        document.getElementById('duration').value =
            '2 hours';

        document.getElementById('targetDate').value =
            '2026-10-20';

        window.addTask();

        expect(window.tasks[0].finished).toBe(false);

        window.toggleFinished(1);

        expect(window.tasks[0].finished).toBe(true);

        const row =
            document.querySelector('#tbody tr');

        expect(row.textContent).toContain('Finished');
    });


    test('Undo should change Finished task back to Pending', () => {

        document.getElementById('topic').value =
            'Operating Systems';

        document.getElementById('duration').value =
            '2 hours';

        document.getElementById('targetDate').value =
            '2026-10-20';

        window.addTask();

        window.toggleFinished(1);

        expect(window.tasks[0].finished).toBe(true);

        window.toggleFinished(1);

        expect(window.tasks[0].finished).toBe(false);

        const row =
            document.querySelector('#tbody tr');

        expect(row.textContent).toContain('Pending');
    });


    test('Edit task should update task details', () => {

        document.getElementById('topic').value =
            'Old Topic';

        document.getElementById('duration').value =
            '1 hour';

        document.getElementById('targetDate').value =
            '2026-10-20';

        document.getElementById('notes').value =
            'Old notes';

        window.addTask();

        window.editTask(1);

        expect(
            document.getElementById('submit').innerText
        ).toBe('Edit Topic');

        document.getElementById('topic').value =
            'New Topic';

        document.getElementById('duration').value =
            '3 hours';

        document.getElementById('targetDate').value =
            '2026-11-01';

        document.getElementById('notes').value =
            'Updated notes';

        window.addTask();

        expect(window.tasks[0].topic)
            .toBe('New Topic');

        expect(window.tasks[0].duration)
            .toBe('3 hours');

        expect(window.tasks[0].targetDate)
            .toBe('2026-11-01');

        expect(window.tasks[0].notes)
            .toBe('Updated notes');
    });


    test('Theme should toggle from dark to light', () => {

        expect(
            document.documentElement.dataset.theme
        ).toBe('dark');

        window.toggleTheme();

        expect(
            document.documentElement.dataset.theme
        ).toBe('light');
    });


    test('Theme should toggle from light back to dark', () => {

        window.toggleTheme();

        expect(
            document.documentElement.dataset.theme
        ).toBe('light');

        window.toggleTheme();

        expect(
            document.documentElement.dataset.theme
        ).toBe('dark');
    });


    test('Reset form should clear all input fields', () => {

        document.getElementById('topic').value =
            'Operating Systems';

        document.getElementById('duration').value =
            '2 hours';

        document.getElementById('targetDate').value =
            '2026-10-10';

        document.getElementById('notes').value =
            'Notes';

        window.resetForm();

        expect(document.getElementById('topic').value)
            .toBe('');

        expect(document.getElementById('duration').value)
            .toBe('');

        expect(document.getElementById('targetDate').value)
            .toBe('');

        expect(document.getElementById('notes').value)
            .toBe('');
    });

});