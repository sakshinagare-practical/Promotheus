pipeline {
    agent any

    environment {
        PATH = "/home/administrator/.nvm/versions/node/v22.0.0/bin:${env.PATH}"
    }

    options {
        disableConcurrentBuilds()
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Project Information') {
            steps {
                sh '''
                    echo "===================================="
                    echo "Student Management System"
                    echo "===================================="

                    echo "Git commit:"
                    git rev-parse --short HEAD

                    echo "Files:"
                    ls -la
                '''
            }
        }

        stage('Check Node.js') {
            steps {
                sh '''
                    echo "Node version:"
                    node --version

                    echo "npm version:"
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Validate Files') {
            steps {
                sh '''
                    test -f index.html
                    test -f style.css
                    test -f script.js
                    test -f package.json
                    test -f test/test.js
                    test -f build.js

                    echo "All required project files exist."
                '''
            }
        }

        stage('Validate JavaScript') {
            steps {
                sh '''
                    node --check script.js
                    node --check test/test.js
                    node --check build.js

                    echo "JavaScript syntax check passed."
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Automated Testing') {
            steps {
                sh 'npm test'
            }
        }

        stage('Test Build') {
            steps {
                sh '''
                    test -f index.html
                    test -f style.css
                    test -f script.js

                    echo "Build verification successful."
                '''
            }
        }
    }

    post {
        success {
            echo '===================================='
            echo 'CI PIPELINE SUCCESS'
            echo '===================================='
        }

        failure {
            echo '===================================='
            echo 'CI PIPELINE FAILED'
            echo 'Check the Console Output.'
            echo '===================================='
        }

        always {
            archiveArtifacts artifacts: 'build/**',
                             allowEmptyArchive: true
        }
    }
}