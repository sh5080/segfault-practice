pipeline {
    agent any

    environment {
        DEVELOP_KEY = credentials('SEGFAULT_KEY')
        gitBranch = ''
    }

    stages {
stage('Checkout') {
    steps {
        script {
            gitBranch = env.GIT_BRANCH.replaceAll('origin/', '')
            git branch: gitBranch, url: 'https://github.com/sh5080/segfault-practice.git'
            echo "gitBranch name: ${gitBranch}"
        }
    }
}


        stage('Build and Deploy') {
            when { 
                expression { gitBranch == 'master'}
            }
            steps {
                script {
                    def nodeHome = tool 'nodeJS'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }


                script {
                    // SSH deploy using credentials
try {
sh 'ssh ${SEGFAULT_USERNAME}@${SEGFAULT_HOST} -p ${DEVELOP_PORT} \'pwd && cd /root/segfault-practice && git pull origin master && git checkout . && npm install && npm run update:prod\''

                    }
                  catch (Exception e) {
sh 'ssh ${SEGFAULT_USERNAME}@${SEGFAULT_HOST} -p ${DEVELOP_PORT} \'pwd && cd /root/segfault-practice && git pull origin master && git checkout . && export NVM_DIR=~/.nvm && source ~/.nvm/nvm.sh && nvm use --delete-prefix v20.10.0 --silent && npm install && npm run update:prod\''

                        currentBuild.result = 'FAILURE'
                        error "Build and Deploy 단계에서 오류 발생: ${e.message}"
                    }
                }
                
            }
        }
    }

    post {
        always {
            echo "파이프라인 실행 결과: ${currentBuild.result}"
        }
        success {
            script {
                def discordWebhook = env.DISCORD_SEGFAULT
                def buildStatus = currentBuild.result ?: 'unknown'
                def commitSha = env.GIT_COMMIT
                def commitMessage = sh(script: 'git log --format=%B -n 1 $GIT_COMMIT', returnStdout: true).trim()

                // Find the branch for the current commit
                def githubCommitUrl = "https://github.com/sh5080/segfault-practice/commit/${commitSha}"
                def discordTitle

                if (gitBranch.contains('develop')) {
                discordTitle = '커밋 완료'
                } else {
                discordTitle = "빌드 및 배포 정상작동 완료"
                }

                    def payload = """
                    {
                        "embeds": [
                            {
                                "title": "${discordTitle}",
                                "description": "The build and deployment process was successful.",
                                "color": 3066993,
                                "fields": [
                                    {"name": "Build Status", "value": "${buildStatus}", "inline": true},
                                    {"name": "Commit Message", "value": "${commitMessage}", "inline": false},
                                    {"name": "Commit", "value": "[${commitSha}](${githubCommitUrl})", "inline": false},
                                    {"name": "Build Number", "value": "${env.BUILD_NUMBER}", "inline": false},
                                    {"name": "Branch", "value": "${gitBranch}", "inline": false}
                                ]
                            }
                        ]
                    }
                    """

                sh "curl -X POST -H 'Content-type: application/json' --data '${payload}' ${discordWebhook}"

            }
        }

        failure {
            script {
                def discordWebhook = env.DISCORD_SEGFAULT
                def buildStatus = currentBuild.result ?: 'unknown'
                def commitSha = env.GIT_COMMIT
                def commitMessage = sh(script: 'git log --format=%B -n 1 $GIT_COMMIT', returnStdout: true).trim()

                def githubCommitUrl = "https://github.com/sh5080/segfault-practice/commit/${commitSha}"


                
                    def payload = """
                    {
                        "embeds": [
                            {
                                "title": "젠킨스 확인 필요",
                                "description": "The build and deployment process failed.",
                                "color": 15158332,
                                "fields": [
                                    {"name": "Build Status", "value": "${buildStatus}", "inline": true},
                                    {"name": "Commit Message", "value": "${commitMessage}", "inline": false},
                                    {"name": "Commit", "value": "[${commitSha}](${githubCommitUrl})", "inline": false},
                                    {"name": "Build Number", "value": "${env.BUILD_NUMBER}", "inline": false},
                                    {"name": "Branch", "value": "${gitBranch}", "inline": false}
                                ]
                            }
                        ]
                    }
                    """
                    sh "curl -X POST -H 'Content-type: application/json' --data '${payload}' ${discordWebhook}"

            }
        }
    }
}
