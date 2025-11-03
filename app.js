// CodeSensei Application Logic
class CodeSensei {
    constructor() {
        this.knowledgeBase = null;
        this.userProgress = {
            topics: {},
            totalQuestions: 0,
            streak: 0,
            lastActiveDate: new Date().toISOString().split('T')[0]
        };
        this.currentMessageId = 1;
        this.mlEngine = new SupervisedLearningEngine();
        
        this.init();
    }

    // Accept broader IT topics
    isITQuery(query) {
        if (!query) return false;
        const q = query.toLowerCase();
        // Core programming (reuse quick code-like detection)
        const codeLike = /(\bfunction\b|\bclass\b|=>|\{\}|;|const\s+|let\s+|def\s+|print\(|for\s*\(|while\s*\(|if\s*\(|try\s*\{?)/i.test(query);
        if (codeLike || this.isProgrammingQuery(q)) return true;

        // Broader IT keywords
        const itTerms = [
            // Web & APIs
            'html','css','javascript','js','frontend','backend','api','rest','json','xml','http','https','cookie','session','cors',
            // Databases
            'database','databases','sql','nosql','mysql','postgres','sqlite','mongodb','query','index','transaction','schema',
            // Networking
            'network','networking','tcp','udp','tcp/ip','ip','ipv4','ipv6','dns','dhcp','nat','subnet','gateway','router','switch','firewall','vpn','ssl','tls','ssh','ftp','smtp','http/2',
            // OS & platforms
            'linux','ubuntu','debian','windows','macos','kernel','process','thread','filesystem','bash','powershell','cmd',
            // Cloud & DevOps
            'cloud','aws','azure','gcp','iam','s3','ec2','lambda','cloudfront','vpc','eks','aks','gke','docker','kubernetes','k8s','container','compose','helm','terraform','ansible','cicd','ci/cd','pipeline',
            // Security
            'security','cybersecurity','xss','csrf','sql injection','hash','encryption','aes','rsa','jwt','oauth','oidc','sso','pentest',
            // Tools & VCS
            'git','github','gitlab','bitbucket','branch','merge','rebase','commit','tag','version','semver',
            // Hardware & Infra
            'cpu','gpu','ram','ssd','nvme','raid','virtualization','hypervisor','vm','vmware','virtualbox',
            // General IT
            'it support','helpdesk','service desk','ticket','sla','monitoring','logging','observability','prometheus','grafana','elk','splunk'
        ];
        return itTerms.some(t => q.includes(t));
    }
    async init() {
        await this.loadKnowledgeBase();
        await this.loadProgress();
        this.setupEventListeners();
        this.updateProgressDisplay();
        await this.checkAuth();
        
        // Initialize supervised learning with current data
        if (this.knowledgeBase) {
            this.mlEngine.knowledgeBase = this.knowledgeBase;
            this.mlEngine.updateFromBehavior(this.userProgress, this.knowledgeBase);
            this.updateRecommendations();
        }
    }

    async loadKnowledgeBase() {
        // Load the full knowledge base directly
        this.knowledgeBase = {
            topics: [
                {
                    id: 'variables',
                    title: 'Variables',
                    description: 'Variables are containers that store data values. They allow you to save information and use it later in your program.',
                    keywords: ['variable', 'var', 'let', 'const', 'assignment', 'declaration', 'data storage'],
                    difficulty: 'beginner',
                    category: 'fundamentals',
                    examples: [
                        {
                            title: 'Basic Variable Declaration',
                            description: 'How to create and assign values to variables',
                            code: '// JavaScript\nlet name = \'Alice\';\nlet age = 25;\nconst isStudent = true;\n\n// Python\nname = \'Alice\'\nage = 25\nis_student = True',
                            explanation: 'Variables store different types of data. \'let\' allows reassignment, \'const\' creates a constant that cannot be changed.'
                        },
                        {
                            title: 'Variable Types',
                            description: 'Different data types you can store in variables',
                            code: '// Numbers\nlet count = 42;\nlet price = 19.99;\n\n// Strings\nlet message = \'Hello, World!\';\nlet name = "Alice";\n\n// Booleans\nlet isActive = true;\nlet isComplete = false;\n\n// Arrays\nlet fruits = [\'apple\', \'banana\', \'orange\'];\n\n// Objects\nlet person = {\n  name: \'Alice\',\n  age: 25,\n  city: \'New York\'\n};',
                            explanation: 'Variables can hold different types of data: numbers, text (strings), true/false values (booleans), lists (arrays), and complex data structures (objects).'
                        }
                    ],
                    commonQuestions: [
                        'What is a variable?',
                        'How do I declare a variable?',
                        'What\'s the difference between let and const?',
                        'What types of data can variables store?'
                    ]
                },
                {
                    id: 'loops',
                    title: 'Loops',
                    description: 'Loops allow you to repeat a block of code multiple times. They\'re essential for processing lists of data and automating repetitive tasks.',
                    keywords: ['loop', 'for', 'while', 'iteration', 'repeat', 'foreach', 'range'],
                    difficulty: 'beginner',
                    category: 'control-flow',
                    examples: [
                        {
                            title: 'For Loop',
                            description: 'Execute code a specific number of times',
                            code: '// JavaScript\nfor (let i = 0; i < 5; i++) {\n  console.log(\'Count:\', i);\n}\n\n// Python\nfor i in range(5):\n    print(f\'Count: {i}\')',
                            explanation: 'For loops run a specific number of times. The counter starts at 0, continues while the condition is true, and increments after each iteration.'
                        },
                        {
                            title: 'While Loop',
                            description: 'Repeat code while a condition is true',
                            code: '// JavaScript\nlet count = 0;\nwhile (count < 3) {\n  console.log(\'Hello!\');\n  count++;\n}\n\n// Python\ncount = 0\nwhile count < 3:\n    print(\'Hello!\')\n    count += 1',
                            explanation: 'While loops continue running as long as the condition is true. Make sure the condition will eventually become false to avoid infinite loops.'
                        },
                        {
                            title: 'Looping Through Arrays',
                            description: 'Process each item in a list',
                            code: '// JavaScript\nlet fruits = [\'apple\', \'banana\', \'orange\'];\nfor (let fruit of fruits) {\n  console.log(\'I like\', fruit);\n}\n\n// Python\nfruits = [\'apple\', \'banana\', \'orange\']\nfor fruit in fruits:\n    print(f\'I like {fruit}\')',
                            explanation: 'You can loop through arrays to process each element. This is very useful for working with lists of data.'
                        }
                    ],
                    commonQuestions: [
                        'What is a loop?',
                        'How do I create a for loop?',
                        'What\'s the difference between for and while loops?',
                        'How do I loop through an array?'
                    ]
                },
                {
                    id: 'functions',
                    title: 'Functions',
                    description: 'Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.',
                    keywords: ['function', 'method', 'def', 'return', 'parameter', 'argument', 'call'],
                    difficulty: 'beginner',
                    category: 'fundamentals',
                    examples: [
                        {
                            title: 'Basic Function',
                            description: 'Creating and calling a simple function',
                            code: '// JavaScript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nlet message = greet(\'Alice\');\nconsole.log(message); // Hello, Alice!\n\n// Python\ndef greet(name):\n    return f\'Hello, {name}!\'\n\nmessage = greet(\'Alice\')\nprint(message)  # Hello, Alice!',
                            explanation: 'Functions take input (parameters), process it, and return output. They make code reusable and organized.'
                        },
                        {
                            title: 'Function with Multiple Parameters',
                            description: 'Functions that accept multiple inputs',
                            code: '// JavaScript\nfunction calculateArea(length, width) {\n  return length * width;\n}\n\nlet area = calculateArea(10, 5);\nconsole.log(\'Area:\', area); // Area: 50\n\n// Python\ndef calculate_area(length, width):\n    return length * width\n\narea = calculate_area(10, 5)\nprint(f\'Area: {area}\')  # Area: 50',
                            explanation: 'Functions can accept multiple parameters. The order of arguments must match the order of parameters.'
                        }
                    ],
                    commonQuestions: [
                        'What is a function?',
                        'How do I create a function?',
                        'What are parameters and arguments?',
                        'How do I return values from functions?'
                    ]
                },
                {
                    id: 'conditionals',
                    title: 'Conditional Statements',
                    description: 'Conditional statements allow your program to make decisions and execute different code based on conditions.',
                    keywords: ['if', 'else', 'elif', 'condition', 'boolean', 'decision', 'branching'],
                    difficulty: 'beginner',
                    category: 'control-flow',
                    examples: [
                        {
                            title: 'Basic If Statement',
                            description: 'Execute code only when a condition is true',
                            code: '// JavaScript\nlet age = 18;\nif (age >= 18) {\n  console.log(\'You are an adult\');\n}\n\n// Python\nage = 18\nif age >= 18:\n    print(\'You are an adult\')',
                            explanation: 'If statements check a condition and execute code only if the condition is true.'
                        },
                        {
                            title: 'If-Else Statement',
                            description: 'Choose between two different actions',
                            code: '// JavaScript\nlet temperature = 25;\nif (temperature > 20) {\n  console.log(\'It\\\'s warm outside\');\n} else {\n  console.log(\'It\\\'s cold outside\');\n}\n\n// Python\ntemperature = 25\nif temperature > 20:\n    print(\'It\\\'s warm outside\')\nelse:\n    print(\'It\\\'s cold outside\')',
                            explanation: 'If-else statements provide an alternative action when the condition is false.'
                        },
                        {
                            title: 'Multiple Conditions',
                            description: 'Handle multiple possible conditions',
                            code: '// JavaScript\nlet score = 85;\nif (score >= 90) {\n  console.log(\'Grade: A\');\n} else if (score >= 80) {\n  console.log(\'Grade: B\');\n} else if (score >= 70) {\n  console.log(\'Grade: C\');\n} else {\n  console.log(\'Grade: F\');\n}\n\n// Python\nscore = 85\nif score >= 90:\n    print(\'Grade: A\')\nelif score >= 80:\n    print(\'Grade: B\')\nelif score >= 70:\n    print(\'Grade: C\')\nelse:\n    print(\'Grade: F\')',
                            explanation: 'You can chain multiple conditions using else-if (elif in Python) to handle different scenarios.'
                        }
                    ],
                    commonQuestions: [
                        'What are conditional statements?',
                        'How do I use if statements?',
                        'What\'s the difference between if and if-else?',
                        'How do I check multiple conditions?'
                    ]
                },
                {
                    id: 'arrays',
                    title: 'Arrays and Lists',
                    description: 'Arrays (or lists) are collections of items stored in a specific order. They allow you to work with multiple pieces of related data.',
                    keywords: ['array', 'list', 'index', 'element', 'length', 'push', 'pop', 'slice'],
                    difficulty: 'beginner',
                    category: 'data-structures',
                    examples: [
                        {
                            title: 'Creating and Accessing Arrays',
                            description: 'How to create arrays and access their elements',
                            code: '// JavaScript\nlet fruits = [\'apple\', \'banana\', \'orange\'];\nconsole.log(fruits[0]); // apple\nconsole.log(fruits.length); // 3\n\n// Python\nfruits = [\'apple\', \'banana\', \'orange\']\nprint(fruits[0])  # apple\nprint(len(fruits))  # 3',
                            explanation: 'Arrays use zero-based indexing. The first element is at index 0, second at index 1, and so on.'
                        },
                        {
                            title: 'Modifying Arrays',
                            description: 'Adding and removing elements from arrays',
                            code: '// JavaScript\nlet numbers = [1, 2, 3];\nnumbers.push(4); // Add to end\nnumbers.unshift(0); // Add to beginning\nnumbers.pop(); // Remove from end\nconsole.log(numbers); // [0, 1, 2, 3]\n\n// Python\nnumbers = [1, 2, 3]\nnumbers.append(4)  # Add to end\nnumbers.insert(0, 0)  # Add to beginning\nnumbers.pop()  # Remove from end\nprint(numbers)  # [0, 1, 2, 3]',
                            explanation: 'You can add elements to the beginning or end of arrays, and remove elements from the end.'
                        }
                    ],
                    commonQuestions: [
                        'What is an array?',
                        'How do I access array elements?',
                        'How do I add items to an array?',
                        'What is array indexing?'
                    ]
                },
                {
                    id: 'objects',
                    title: 'Objects and Dictionaries',
                    description: 'Objects (or dictionaries) store data as key-value pairs. They\'re perfect for representing real-world entities with multiple properties.',
                    keywords: ['object', 'dictionary', 'key', 'value', 'property', 'method', 'json'],
                    difficulty: 'intermediate',
                    category: 'data-structures',
                    examples: [
                        {
                            title: 'Creating Objects',
                            description: 'How to create and access object properties',
                            code: '// JavaScript\nlet person = {\n  name: \'Alice\',\n  age: 25,\n  city: \'New York\',\n  isStudent: true\n};\n\nconsole.log(person.name); // Alice\nconsole.log(person[\'age\']); // 25\n\n// Python\nperson = {\n    \'name\': \'Alice\',\n    \'age\': 25,\n    \'city\': \'New York\',\n    \'is_student\': True\n}\n\nprint(person[\'name\'])  # Alice\nprint(person.get(\'age\'))  # 25',
                            explanation: 'Objects store data as key-value pairs. You can access values using dot notation or bracket notation.'
                        },
                        {
                            title: 'Object Methods',
                            description: 'Adding functions to objects',
                            code: '// JavaScript\nlet calculator = {\n  add: function(a, b) {\n    return a + b;\n  },\n  multiply: function(a, b) {\n    return a * b;\n  }\n};\n\nconsole.log(calculator.add(5, 3)); // 8\n\n// Python\nclass Calculator:\n    def add(self, a, b):\n        return a + b\n    \n    def multiply(self, a, b):\n        return a * b\n\ncalc = Calculator()\nprint(calc.add(5, 3))  # 8',
                            explanation: 'Objects can contain methods (functions) that operate on the object\'s data.'
                        }
                    ],
                    commonQuestions: [
                        'What is an object?',
                        'How do I create an object?',
                        'How do I access object properties?',
                        'What\'s the difference between objects and arrays?'
                    ]
                },
                {
                    id: 'classes',
                    title: 'Classes and Object-Oriented Programming',
                    description: 'Classes are blueprints for creating objects. They define the structure and behavior that objects of that type will have.',
                    keywords: ['class', 'object', 'constructor', 'method', 'inheritance', 'encapsulation', 'polymorphism'],
                    difficulty: 'intermediate',
                    category: 'oop',
                    examples: [
                        {
                            title: 'Basic Class',
                            description: 'Creating a simple class with properties and methods',
                            code: '// JavaScript\nclass Person {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n  \n  greet() {\n    return `Hello, I\\\'m ${this.name}`;\n  }\n}\n\nlet person = new Person(\'Alice\', 25);\nconsole.log(person.greet()); // Hello, I\'m Alice\n\n// Python\nclass Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def greet(self):\n        return f\'Hello, I\\\'m {self.name}\'\n\nperson = Person(\'Alice\', 25)\nprint(person.greet())  # Hello, I\'m Alice',
                            explanation: 'Classes define the structure of objects. The constructor initializes new instances, and methods define the object\'s behavior.'
                        },
                        {
                            title: 'Inheritance',
                            description: 'Creating new classes based on existing ones',
                            code: '// JavaScript\nclass Student extends Person {\n  constructor(name, age, grade) {\n    super(name, age);\n    this.grade = grade;\n  }\n  \n  study() {\n    return `${this.name} is studying`;\n  }\n}\n\nlet student = new Student(\'Bob\', 20, \'A\');\nconsole.log(student.greet()); // Hello, I\'m Bob\nconsole.log(student.study()); // Bob is studying\n\n// Python\nclass Student(Person):\n    def __init__(self, name, age, grade):\n        super().__init__(name, age)\n        self.grade = grade\n    \n    def study(self):\n        return f\'{self.name} is studying\'\n\nstudent = Student(\'Bob\', 20, \'A\')\nprint(student.greet())  # Hello, I\'m Bob\nprint(student.study())  # Bob is studying',
                            explanation: 'Inheritance allows new classes to inherit properties and methods from existing classes, promoting code reuse.'
                        }
                    ],
                    commonQuestions: [
                        'What is a class?',
                        'How do I create a class?',
                        'What is inheritance?',
                        'What\'s the difference between a class and an object?'
                    ]
                },
                {
                    id: 'error-handling',
                    title: 'Error Handling',
                    description: 'Error handling allows your program to gracefully deal with unexpected situations and continue running instead of crashing.',
                    keywords: ['try', 'catch', 'error', 'exception', 'throw', 'finally', 'debugging'],
                    difficulty: 'intermediate',
                    category: 'advanced',
                    examples: [
                        {
                            title: 'Basic Try-Catch',
                            description: 'Catching and handling errors',
                            code: '// JavaScript\ntry {\n  let result = 10 / 0;\n  console.log(\'Result:\', result);\n} catch (error) {\n  console.log(\'An error occurred:\', error.message);\n} finally {\n  console.log(\'This always runs\');\n}\n\n// Python\ntry:\n    result = 10 / 0\n    print(f\'Result: {result}\')\nexcept ZeroDivisionError as e:\n    print(f\'An error occurred: {e}\')\nfinally:\n    print(\'This always runs\')',
                            explanation: 'Try-catch blocks allow you to handle errors gracefully. The finally block always executes, regardless of whether an error occurred.'
                        },
                        {
                            title: 'Throwing Custom Errors',
                            description: 'Creating and throwing your own errors',
                            code: '// JavaScript\nfunction divide(a, b) {\n  if (b === 0) {\n    throw new Error(\'Cannot divide by zero\');\n  }\n  return a / b;\n}\n\ntry {\n  let result = divide(10, 0);\n} catch (error) {\n  console.log(\'Error:\', error.message);\n}\n\n// Python\ndef divide(a, b):\n    if b == 0:\n        raise ValueError(\'Cannot divide by zero\')\n    return a / b\n\ntry:\n    result = divide(10, 0)\nexcept ValueError as e:\n    print(f\'Error: {e}\')',
                            explanation: 'You can create custom errors to provide meaningful feedback when something goes wrong in your program.'
                        }
                    ],
                    commonQuestions: [
                        'What is error handling?',
                        'How do I catch errors?',
                        'How do I create custom errors?',
                        'What\'s the difference between try, catch, and finally?'
                    ]
                }
            ],
            categories: {
                'fundamentals': 'Basic programming concepts',
                'control-flow': 'How programs make decisions and repeat actions',
                'data-structures': 'Ways to organize and store data',
                'oop': 'Object-oriented programming concepts',
                'advanced': 'More complex programming topics'
            },
            difficultyLevels: {
                'beginner': 'Suitable for those new to programming',
                'intermediate': 'Requires some programming experience',
                'advanced': 'For experienced programmers'
            }
        };
        console.log('Knowledge base loaded:', this.knowledgeBase.topics.length, 'topics');
    }

    async loadProgress() {
        try {
            const savedProgress = localStorage.getItem('codesensei-progress');
            if (savedProgress) {
                this.userProgress = JSON.parse(savedProgress);
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }

    isProgrammingQuery(query) {
        if (!query) return false;
        const q = query.toLowerCase();
        // Whitelist of programming terms and code patterns
        const terms = [
            'program', 'code', 'coding', 'developer', 'debug', 'bug', 'algorithm', 'data structure',
            'variable', 'variables', 'var', 'let', 'const',
            'loop', 'loops', 'for', 'while', 'foreach',
            'function', 'functions', 'method', 'return', 'parameter', 'argument',
            'array', 'arrays', 'list', 'lists', 'index',
            'object', 'objects', 'dictionary', 'json', 'key', 'value',
            'class', 'classes', 'constructor', 'inheritance', 'oop',
            'conditional', 'conditionals', 'if', 'else', 'elif',
            'error', 'errors', 'exception', 'exceptions', 'try', 'catch', 'finally',
            'javascript', 'python', 'js', 'py'
        ];
        // Quick hit if code-like tokens are present
        const codeLike = /(\bfunction\b|\bclass\b|=>|\{\}|;|const\s+|let\s+|def\s+|print\(|for\s*\(|while\s*\(|if\s*\(|try\s*\{?)/i.test(query);
        if (codeLike) return true;
        return terms.some(t => q.includes(t));
    }

    async saveProgress() {
        try {
            localStorage.setItem('codesensei-progress', JSON.stringify(this.userProgress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    setupEventListeners() {
        // Sidebar toggle
        this.el('menuBtn').addEventListener('click', () => {
            this.el('sidebar').classList.add('open');
        });

        this.el('closeSidebar').addEventListener('click', () => {
            this.el('sidebar').classList.remove('open');
        });

        // Progress modal
        this.el('progressBtn').addEventListener('click', () => {
            this.setDisplay('progressModal', 'flex');
        });

        this.el('showProgress').addEventListener('click', () => {
            this.el('sidebar').classList.remove('open');
            this.setDisplay('progressModal', 'flex');
        });

        this.el('closeProgressModal').addEventListener('click', () => {
            this.setDisplay('progressModal', 'none');
        });

        // Close modal on overlay click
        this.el('progressModal').addEventListener('click', (e) => {
            if (e.target === this.el('progressModal')) {
                this.setDisplay('progressModal', 'none');
            }
        });

        // Message input
        const inputForm = this.el('inputForm');
        const messageInput = this.el('messageInput');
        const sendBtn = this.el('sendBtn');

        inputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = messageInput.value.trim();
            if (message) {
                this.sendMessage(message);
                messageInput.value = '';
            }
        });

        // Quick questions and suggestions
        this.qsAll('.question-btn, .suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                if (question) {
                    this.sendMessage(question);
                    this.el('sidebar').classList.remove('open');
                }
            });
        });

        // Topic buttons
        this.qsAll('.topic-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const topic = btn.dataset.topic;
                if (topic) {
                    this.sendMessage(`Tell me about ${topic}`);
                    this.el('sidebar').classList.remove('open');
                }
            });
        });

        // Enable/disable send button based on input
        messageInput.addEventListener('input', () => {
            sendBtn.disabled = !messageInput.value.trim();
        });

        // Profile openers and closer
        const profileBtn = this.el('profileBtn');
        const profileSidebar = this.el('profileSidebar');
        const closeProfileModal = this.el('closeProfileModal');
        [profileBtn, profileSidebar].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.openProfile();
                    this.el('sidebar').classList.remove('open');
                });
            }
        });
        if (closeProfileModal) {
            closeProfileModal.addEventListener('click', () => {
                this.setDisplay('profileModal', 'none');
            });
        }
        const clearHistoryBtn = this.el('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearSearchHistory());
        }

        // Login form
        const loginForm = this.el('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLoginSubmit();
            });
        }

        // Password visibility toggle
        const passInput = this.el('loginPassword');
        const passToggle = this.el('loginPasswordToggle');
        if (passInput && passToggle) {
            passToggle.addEventListener('click', () => {
                const isPassword = passInput.getAttribute('type') === 'password';
                passInput.setAttribute('type', isPassword ? 'text' : 'password');
                const icon = passToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            });
        }

        // Guest login
        const guestBtn = this.el('loginGuestBtn');
        if (guestBtn) {
            guestBtn.addEventListener('click', () => this.loginAsGuest());
        }

        // Logout buttons
        const logoutHeader = this.el('logoutHeader');
        const logoutSidebar = this.el('logoutSidebar');
        [logoutHeader, logoutSidebar].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.logout());
            }
        });
    }

    // ===== Profile & User =====
    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('codesensei-user') || 'null');
        } catch {
            return null;
        }
    }

    getHistoryKey(emailOrGuest) {
        return `codesensei-history-${emailOrGuest}`;
    }

    openProfile() {
        const user = this.getCurrentUser();
        const modal = this.el('profileModal');
        if (!modal) return;
        const emailEl = this.el('profileEmail');
        const totalEl = this.el('profileTotalQuestions');
        const topicsEl = this.el('profileTopicsExplored');
        const listEl = this.el('profileHistoryList');

        // Populate identity
        emailEl.textContent = user ? (user.guest ? 'Guest' : user.email) : '-';

        // Populate stats
        totalEl.textContent = this.userProgress.totalQuestions;
        topicsEl.textContent = Object.keys(this.userProgress.topics).length;

        // Populate history
        const key = this.getHistoryKey(user && !user.guest ? user.email : 'guest');
        const history = JSON.parse(localStorage.getItem(key) || '[]');
        listEl.innerHTML = '';
        if (history.length === 0) {
            listEl.innerHTML = '<div style="color:#6b7280;">No history yet.</div>';
        } else {
            history.slice().reverse().forEach(item => {
                const div = document.createElement('div');
                div.style.padding = '0.5rem';
                div.style.borderBottom = '1px solid #f3f4f6';
                div.innerHTML = `<div style="font-weight:500; color:#111827;">${item.query}</div><div style="font-size:0.75rem; color:#6b7280;">${new Date(item.time).toLocaleString()}</div>`;
                listEl.appendChild(div);
            });
        }

        this.setDisplay('profileModal', 'flex');
    }

    clearSearchHistory() {
        const user = this.getCurrentUser();
        const key = this.getHistoryKey(user && !user.guest ? user.email : 'guest');
        localStorage.removeItem(key);
        // Refresh list
        this.openProfile();
    }

    async sendMessage(content) {
        // Add user message
        this.addMessage('user', content);
        
        // Save to search history
        const user = this.getCurrentUser();
        if (user) {
            const key = this.getHistoryKey(user && !user.guest ? user.email : 'guest');
            const history = JSON.parse(localStorage.getItem(key) || '[]');
            history.push({ query: content, time: new Date().toISOString() });
            // Keep only last 50 entries
            const recentHistory = history.slice(-50);
            localStorage.setItem(key, JSON.stringify(recentHistory));
        }

        // Show typing indicator
        this.showTypingIndicator();

        // Disable input
        this.setInputEnabled(false);

        try {
            // Only allow IT-related queries (programming, networking, OS, DB, cloud, security, etc.)
            if (!this.isITQuery(content)) {
                this.addMessage('assistant', "I can help with IT topics: programming, web, databases, networking, operating systems, cloud/DevOps, and cybersecurity. Please ask an IT-related question.");
                return;
            }
            // Search knowledge base
            const results = this.searchKnowledgeBase(content);
            
            if (results.length > 0) {
                const bestMatch = results[0];
                
                // Update progress
                this.updateProgress(bestMatch.id);

                // Learn from this interaction (supervised learning)
                this.mlEngine.learnFromInteraction(this.userProgress, this.knowledgeBase, bestMatch.id, true);

                // Add assistant response
                const response = this.formatResponse(bestMatch);
                this.addMessage('assistant', response);
                
                // Update recommendations based on learning
                this.updateRecommendations();
                
                // Ensure scroll after content is rendered
                setTimeout(() => {
                    this.scrollToBottom();
                }, 300);
            } else {
                this.addMessage('assistant', "I'm not sure I understand that question. Could you try asking about programming concepts like variables, loops, functions, arrays, or objects? I'm here to help you learn programming fundamentals!");
            }
        } catch (error) {
            console.error('Error processing message:', error);
            this.addMessage('assistant', "I'm sorry, I encountered an error. Please try again.");
        } finally {
            // Hide typing indicator and re-enable input
            this.hideTypingIndicator();
            this.setInputEnabled(true);
        }
    }

    searchKnowledgeBase(query) {
        if (!this.knowledgeBase) return [];

        const queryLower = (query || '').toLowerCase().trim();
        if (!queryLower) return [];

        // Basic normalization
        const cleaned = queryLower.replace(/[^\w\s]/g, ' ');
        const stop = new Set(['what','is','are','how','do','does','can','could','tell','me','about','explain','the','a','an','of','in','to','for','on']);
        let terms = cleaned.split(/\s+/).filter(t => t && t.length > 1 && !stop.has(t));
        if (terms.length === 0) terms = [queryLower];

        // Simple synonyms expansion
        const synonyms = {
            'array': ['list','lists','arrays'],
            'arrays': ['list','lists','array'],
            'list': ['array','arrays','lists'],
            'function': ['functions','method','methods','def'],
            'functions': ['function','method','methods','def'],
            'object': ['objects','dictionary','dict','dictionaries'],
            'objects': ['object','dictionary','dict','dictionaries'],
            'loop': ['loops','iterate','iteration','for','while'],
            'loops': ['loop','iterate','iteration','for','while'],
            'variable': ['variables','var','let','const'],
            'variables': ['variable','var','let','const'],
            'class': ['classes','oop'],
            'classes': ['class','oop'],
            'error': ['errors','exception','exceptions'],
            'exceptions': ['error','errors','exception']
        };
        const expanded = new Set(terms);
        for (const t of terms) {
            const syns = synonyms[t];
            if (syns) syns.forEach(s => expanded.add(s));
        }
        const allTerms = Array.from(expanded);

        const results = [];

        // Pre-compute word-boundary regex for whole-word matches
        const wordRegexes = allTerms.map(t => new RegExp(`(^|\\b)${t.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}(\\b|$)`, 'i'));

        for (const topic of this.knowledgeBase.topics) {
            let score = 0;
            const title = topic.title.toLowerCase();
            const desc = topic.description.toLowerCase();
            const keywords = (topic.keywords || []).map(k => k.toLowerCase());

            // Exact phrase equality boosts
            if (title === queryLower) score += 60;
            if (keywords.includes(queryLower)) score += 60;

            // Exact id match
            if (topic.id && topic.id.toLowerCase() === queryLower) score += 50;

            // Whole-word matches in title/keywords (high)
            for (const re of wordRegexes) {
                if (re.test(title)) score += 25;
                for (const kw of keywords) {
                    if (re.test(kw)) score += 30;
                }
            }

            // Contains matches (medium)
            for (const term of allTerms) {
                if (title.includes(term)) score += 15;
                for (const kw of keywords) {
                    if (kw.includes(term) || term.includes(kw)) score += 12;
                }
                if (desc.includes(term)) score += 6;
            }

            // Common questions (medium-high)
            for (const question of (topic.commonQuestions || [])) {
                const ql = question.toLowerCase();
                if (ql === queryLower) score += 40;
                for (const re of wordRegexes) {
                    if (re.test(ql)) score += 15;
                }
                for (const term of allTerms) {
                    if (ql.includes(term)) score += 8;
                }
            }

            // Examples lightweight check
            for (const example of (topic.examples || [])) {
                const et = (example.title || '').toLowerCase();
                const ed = (example.description || '').toLowerCase();
                for (const re of wordRegexes) {
                    if (re.test(et)) score += 5;
                    if (re.test(ed)) score += 3;
                }
            }

            if (score > 0) results.push({ ...topic, score });
        }

        return results.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    formatResponse(topic) {
        let response = `## ${topic.title}\n\n${topic.description}\n\n`;
        
        if (topic.examples && topic.examples.length > 0) {
            response += `### Examples:\n\n`;
            topic.examples.forEach((example, index) => {
                response += `**${example.title}**\n${example.description}\n\n`;
                if (example.code) {
                    response += `\`\`\`${this.getLanguageFromCode(example.code)}\n${example.code}\n\`\`\`\n\n`;
                }
                response += `${example.explanation}\n\n`;
            });
        }

        if (topic.commonQuestions && topic.commonQuestions.length > 0) {
            response += `### Related Questions:\n`;
            topic.commonQuestions.forEach(question => {
                response += `• ${question}\n`;
            });
        }

        return response;
    }

    getLanguageFromCode(code) {
        if (code.includes('// JavaScript') || code.includes('let ') || code.includes('const ')) {
            return 'javascript';
        } else if (code.includes('# Python') || code.includes('def ') || code.includes('print(')) {
            return 'python';
        }
        return 'text';
    }

    addMessage(type, content) {
        const messagesContainer = this.el('messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        messageElement.id = `message-${this.currentMessageId++}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (type === 'assistant') {
            // Use marked.js to parse markdown
            messageContent.innerHTML = marked.parse(content);
            // Highlight code blocks
            messageContent.querySelectorAll('pre code').forEach(block => {
                Prism.highlightElement(block);
            });
        } else {
            messageContent.innerHTML = `<p>${content}</p>`;
        }

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = 'Just now';

        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTime);

        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom immediately and smoothly
        setTimeout(() => {
            this.scrollToBottom();
        }, 50);

        // Hide suggestions after first message
        if (this.currentMessageId > 2) {
            this.setDisplay('suggestions', 'none');
            // Show AI recommendations after a few interactions
            if (this.currentMessageId > 3 && this.userProgress.totalQuestions >= 2) {
                this.showAIRecommendations();
            }
        }
    }

    showTypingIndicator() {
        this.setDisplay('typingIndicator', 'block');
        setTimeout(() => {
            this.scrollToBottom();
        }, 50);
    }

    hideTypingIndicator() {
        this.setDisplay('typingIndicator', 'none');
    }

    scrollToBottom() {
        const messagesContainer = this.el('messages');
        const scroller = messagesContainer ? messagesContainer.parentElement : null;
        if (scroller) {
            scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
        }
    }

    setInputEnabled(enabled) {
        const messageInput = this.el('messageInput');
        const sendBtn = this.el('sendBtn');
        const suggestionBtns = this.qsAll('.suggestion-btn');
        
        messageInput.disabled = !enabled;
        sendBtn.disabled = !enabled || !messageInput.value.trim();
        
        suggestionBtns.forEach(btn => {
            btn.disabled = !enabled;
        });
    }

    // ===== Authentication =====
    async checkAuth() {
        const userJson = localStorage.getItem('codesensei-user');
        if (!userJson) {
            // Not logged in
            this.setInputEnabled(false);
            this.showLoginModal();
            return;
        }
        // Logged in
        this.setInputEnabled(true);
        this.hideLoginModal();
    }

    showLoginModal() {
        this.setDisplay('loginModal', 'flex');
        const emailEl = this.el('loginEmail');
        if (emailEl) emailEl.focus();
    }

    hideLoginModal() {
        this.setDisplay('loginModal', 'none');
        const errorEl = this.el('loginError');
        if (errorEl) errorEl.style.display = 'none';
    }

    setDisplay(id, value) {
        const el = this.el(id);
        if (el) el.style.display = value;
    }

    el(id) {
        return document.getElementById(id);
    }

    qsAll(selector) {
        return document.querySelectorAll(selector);
    }

    getUsersStore() {
        try {
            return JSON.parse(localStorage.getItem('codesensei-users') || '{}');
        } catch {
            return {};
        }
    }

    saveUsersStore(store) {
        localStorage.setItem('codesensei-users', JSON.stringify(store));
    }

    async hashPassword(password) {
        const enc = new TextEncoder();
        const data = enc.encode(password);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const bytes = Array.from(new Uint8Array(digest));
        return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async handleLoginSubmit() {
        const emailEl = this.el('loginEmail');
        const passEl = this.el('loginPassword');
        const errorEl = this.el('loginError');
        const email = (emailEl?.value || '').trim().toLowerCase();
        const password = passEl?.value || '';

        if (!email || !password) {
            if (errorEl) {
                errorEl.textContent = 'Please provide both email and password.';
                errorEl.style.display = 'block';
            }
            return;
        }

        const store = this.getUsersStore();
        const hash = await this.hashPassword(password);
        const existing = store[email];

        if (!existing) {
            // Create account
            store[email] = { passwordHash: hash, createdAt: Date.now() };
            this.saveUsersStore(store);
        } else if (existing.passwordHash !== hash) {
            if (errorEl) {
                errorEl.textContent = 'Invalid credentials. Please try again.';
                errorEl.style.display = 'block';
            }
            return;
        }

        // Save current session user
        localStorage.setItem('codesensei-user', JSON.stringify({ email }));
        this.hideLoginModal();
        this.setInputEnabled(true);
    }

    logout() {
        localStorage.removeItem('codesensei-user');
        // Optionally clear progress for privacy; keeping progress by default
        this.showLoginModal();
        this.setInputEnabled(false);
        // Close sidebar if open
        const sidebar = this.el('sidebar');
        if (sidebar) sidebar.classList.remove('open');
    }

    loginAsGuest() {
        // Create a guest session
        localStorage.setItem('codesensei-user', JSON.stringify({ email: 'guest', guest: true }));
        this.hideLoginModal();
        this.setInputEnabled(true);
    }

    updateProgress(topicId) {
        if (!this.userProgress.topics[topicId]) {
            this.userProgress.topics[topicId] = {
                questionsAsked: 0,
                lastAsked: null
            };
        }

        this.userProgress.topics[topicId].questionsAsked++;
        this.userProgress.topics[topicId].lastAsked = new Date().toISOString();
        this.userProgress.totalQuestions++;

        // Update streak
        const today = new Date().toISOString().split('T')[0];
        if (this.userProgress.lastActiveDate === today) {
            // Already counted today
        } else if (this.userProgress.lastActiveDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]) {
            this.userProgress.streak++;
        } else {
            this.userProgress.streak = 1;
        }
        this.userProgress.lastActiveDate = today;

        this.saveProgress();
        this.updateProgressDisplay();
        
        // Update supervised learning model
        if (this.knowledgeBase) {
            this.mlEngine.updateFromBehavior(this.userProgress, this.knowledgeBase);
        }
    }

    updateProgressDisplay() {
        // Update stats
        this.el('totalQuestions').textContent = this.userProgress.totalQuestions;
        const topicsCountEl = this.el('topicsExplored');
        if (topicsCountEl) {
            topicsCountEl.textContent = Object.keys(this.userProgress.topics).length;
        }

        // Update topic progress
        const topicsProgress = this.el('topicsProgress');
        topicsProgress.innerHTML = '';

        const topics = [
            { id: 'variables', name: 'Variables', icon: '📝' },
            { id: 'loops', name: 'Loops', icon: '🔄' },
            { id: 'functions', name: 'Functions', icon: '⚙️' },
            { id: 'conditionals', name: 'Conditionals', icon: '🔀' },
            { id: 'arrays', name: 'Arrays', icon: '📋' },
            { id: 'objects', name: 'Objects', icon: '📦' },
            { id: 'classes', name: 'Classes', icon: '🏗️' },
            { id: 'error-handling', name: 'Error Handling', icon: '⚠️' }
        ];

        topics.forEach(topic => {
            const topicData = this.userProgress.topics[topic.id];
            const questionsAsked = topicData ? topicData.questionsAsked : 0;
            const progressPercentage = Math.min((questionsAsked / 5) * 100, 100);

            const topicElement = document.createElement('div');
            topicElement.className = 'topic-progress';
            topicElement.innerHTML = `
                <div class="topic-progress-header">
                    <div class="topic-progress-title">
                        <span class="topic-icon">${topic.icon}</span>
                        <span>${topic.name}</span>
                    </div>
                    <div class="topic-progress-count">${questionsAsked} questions</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <div class="progress-text">
                    ${progressPercentage >= 100 ? 'Complete!' : `${Math.round(progressPercentage)}% complete`}
                </div>
            `;

            topicsProgress.appendChild(topicElement);
        });
        
        // Update ML recommendations and insights
        this.updateRecommendations();
        this.updateLearningInsights();
    }

    // Update personalized recommendations using supervised learning
    updateRecommendations() {
        if (!this.knowledgeBase) return;
        
        const recommendationsContainer = this.el('mlRecommendations');
        if (!recommendationsContainer) return;

        const recommendations = this.mlEngine.getRecommendations(this.userProgress, this.knowledgeBase, 3);
        
        recommendationsContainer.innerHTML = '';
        
        if (recommendations.length === 0) {
            recommendationsContainer.innerHTML = '<p style="color: #6b7280; padding: 1rem;">Keep exploring topics to get personalized recommendations!</p>';
            return;
        }

        recommendations.forEach((rec, index) => {
            const recElement = document.createElement('div');
            recElement.className = 'recommendation-card';
            recElement.style.cssText = `
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                padding: 1rem;
                margin-bottom: 0.75rem;
                cursor: pointer;
                transition: all 0.2s;
            `;
            recElement.onmouseover = () => {
                recElement.style.borderColor = '#3b82f6';
                recElement.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.1)';
            };
            recElement.onmouseout = () => {
                recElement.style.borderColor = '#e5e7eb';
                recElement.style.boxShadow = 'none';
            };
            recElement.onclick = () => {
                this.sendMessage(`Tell me about ${rec.topic.title.toLowerCase()}`);
                this.setDisplay('progressModal', 'none');
            };

            const confidencePercent = Math.round(rec.confidence * 100);
            const icon = this.getTopicIcon(rec.topic.id);
            
            recElement.innerHTML = `
                <div style="display: flex; align-items: start; gap: 0.75rem;">
                    <div style="font-size: 1.5rem;">${icon}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #111827; margin-bottom: 0.25rem;">
                            ${rec.topic.title}
                        </div>
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">
                            ${rec.reason}
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="flex: 1; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
                                <div style="height: 100%; width: ${confidencePercent}%; background: #3b82f6; transition: width 0.3s;"></div>
                            </div>
                            <span style="font-size: 0.75rem; color: #6b7280;">${confidencePercent}% match</span>
                        </div>
                    </div>
                </div>
            `;

            recommendationsContainer.appendChild(recElement);
        });
    }

    // Update learning insights from ML model
    updateLearningInsights() {
        if (!this.knowledgeBase) return;
        
        const insightsContainer = this.el('mlInsights');
        if (!insightsContainer) return;

        const insights = this.mlEngine.getLearningInsights(this.userProgress, this.knowledgeBase);
        
        insightsContainer.innerHTML = `
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem;">
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Learning Style</div>
                    <div style="font-weight: 600; color: #111827; text-transform: capitalize;">
                        ${insights.learningStyle.replace('-', ' ')}
                    </div>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">Preferred Difficulty</div>
                    <div style="font-weight: 600; color: #111827; text-transform: capitalize;">
                        ${insights.preferredDifficulty}
                    </div>
                </div>
                
                ${insights.strengths.length > 0 ? `
                    <div style="margin-bottom: 1rem;">
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Your Strengths</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${insights.strengths.map(strength => `
                                <span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">
                                    ${strength}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${insights.areasForGrowth.length > 0 ? `
                    <div>
                        <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">Areas to Explore</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${insights.areasForGrowth.map(area => `
                                <span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;">
                                    ${area}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : '<p style="color: #6b7280; font-size: 0.875rem;">Explore more topics to see insights!</p>'}
            </div>
        `;
    }

    // Show AI recommendations in the chat interface
    showAIRecommendations() {
        if (!this.knowledgeBase) return;
        
        const recommendationsContainer = this.el('aiRecommendations');
        const recommendationsList = this.el('recommendationsList');
        
        if (!recommendationsContainer || !recommendationsList) return;

        const recommendations = this.mlEngine.getRecommendations(this.userProgress, this.knowledgeBase, 3);
        
        if (recommendations.length === 0) {
            this.setDisplay('aiRecommendations', 'none');
            return;
        }

        recommendationsList.innerHTML = '';
        
        recommendations.forEach(rec => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-btn recommendation-btn';
            btn.innerHTML = `
                <span style="margin-right: 0.5rem;">${this.getTopicIcon(rec.topic.id)}</span>
                <span>${rec.topic.title}</span>
                <span style="margin-left: auto; font-size: 0.75rem; opacity: 0.7;">${Math.round(rec.confidence * 100)}%</span>
            `;
            btn.onclick = () => {
                this.sendMessage(`Tell me about ${rec.topic.title.toLowerCase()}`);
            };
            recommendationsList.appendChild(btn);
        });

        this.setDisplay('aiRecommendations', 'flex');
    }

    // Helper to get topic icon
    getTopicIcon(topicId) {
        const iconMap = {
            'variables': '📝',
            'loops': '🔄',
            'functions': '⚙️',
            'conditionals': '🔀',
            'arrays': '📋',
            'objects': '📦',
            'classes': '🏗️',
            'error-handling': '⚠️'
        };
        return iconMap[topicId] || '📚';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.codeSensei = new CodeSensei();
});

// Handle window close to save progress
window.addEventListener('beforeunload', () => {
    if (window.codeSensei) {
        window.codeSensei.saveProgress();
    }
});
