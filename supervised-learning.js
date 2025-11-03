// Supervised Learning Module for CodeSensei
// This module implements machine learning to personalize the learning experience

class SupervisedLearningEngine {
    constructor() {
        this.trainingData = [];
        this.model = {
            weights: {},
            biases: {},
            featureImportance: {}
        };
        this.featureNames = [
            'topic_frequency',
            'topic_difficulty',
            'topic_category',
            'time_spent',
            'questions_per_topic',
            'learning_path_sequence',
            'topic_similarity'
        ];
        this.initialized = false;
        this.loadTrainingData();
    }

    // Load existing training data from localStorage
    loadTrainingData() {
        try {
            const saved = localStorage.getItem('codesensei-ml-data');
            if (saved) {
                const data = JSON.parse(saved);
                this.trainingData = data.trainingData || [];
                this.model = data.model || this.model;
                this.initialized = data.initialized || false;
            }
        } catch (error) {
            console.error('Error loading ML data:', error);
        }
    }

    // Save training data to localStorage
    saveTrainingData() {
        try {
            localStorage.setItem('codesensei-ml-data', JSON.stringify({
                trainingData: this.trainingData,
                model: this.model,
                initialized: this.initialized
            }));
        } catch (error) {
            console.error('Error saving ML data:', error);
        }
    }

    // Extract features from user behavior
    extractFeatures(userProgress, knowledgeBase, currentTopic = null) {
        const features = {};
        
        // Calculate topic frequencies
        const topicFrequencies = {};
        const allTopics = knowledgeBase.topics || [];
        
        Object.keys(userProgress.topics || {}).forEach(topicId => {
            topicFrequencies[topicId] = userProgress.topics[topicId].questionsAsked || 0;
        });

        // Feature 1: Topic frequency (how many questions asked about this topic)
        features.topic_frequency = currentTopic 
            ? (topicFrequencies[currentTopic] || 0) 
            : Object.values(topicFrequencies).reduce((a, b) => a + b, 0) / allTopics.length;

        // Feature 2: Topic difficulty (normalized)
        if (currentTopic) {
            const topic = allTopics.find(t => t.id === currentTopic);
            if (topic) {
                const difficultyMap = { 'beginner': 0.33, 'intermediate': 0.66, 'advanced': 1.0 };
                features.topic_difficulty = difficultyMap[topic.difficulty] || 0.5;
            } else {
                features.topic_difficulty = 0.5;
            }
        } else {
            features.topic_difficulty = 0.5;
        }

        // Feature 3: Topic category (encoded)
        if (currentTopic) {
            const topic = allTopics.find(t => t.id === currentTopic);
            const categoryMap = {
                'fundamentals': 0.2,
                'control-flow': 0.4,
                'data-structures': 0.6,
                'oop': 0.8,
                'advanced': 1.0
            };
            features.topic_category = topic ? (categoryMap[topic.category] || 0.5) : 0.5;
        } else {
            features.topic_category = 0.5;
        }

        // Feature 4: Time spent (estimated from questions count)
        features.time_spent = userProgress.totalQuestions || 0;

        // Feature 5: Questions per topic (engagement level)
        const exploredTopics = Object.keys(userProgress.topics || {}).length;
        features.questions_per_topic = exploredTopics > 0 
            ? userProgress.totalQuestions / exploredTopics 
            : 0;

        // Feature 6: Learning path sequence (order of topics explored)
        const topicOrder = Object.keys(userProgress.topics || {}).map(topicId => {
            const topic = userProgress.topics[topicId];
            return {
                id: topicId,
                order: topic.lastAsked ? new Date(topic.lastAsked).getTime() : 0
            };
        }).sort((a, b) => a.order - b.order).map(t => t.id);
        
        if (currentTopic) {
            const index = topicOrder.indexOf(currentTopic);
            features.learning_path_sequence = index >= 0 ? (index + 1) / Math.max(topicOrder.length, 1) : 0.5;
        } else {
            features.learning_path_sequence = topicOrder.length / Math.max(allTopics.length, 1);
        }

        // Feature 7: Topic similarity (based on category and difficulty)
        if (currentTopic) {
            const currentTopicData = allTopics.find(t => t.id === currentTopic);
            let similaritySum = 0;
            let count = 0;
            
            Object.keys(userProgress.topics || {}).forEach(exploredId => {
                const explored = allTopics.find(t => t.id === exploredId);
                if (explored && currentTopicData) {
                    const catMatch = explored.category === currentTopicData.category ? 1 : 0;
                    const diffMatch = explored.difficulty === currentTopicData.difficulty ? 1 : 0;
                    similaritySum += (catMatch * 0.6 + diffMatch * 0.4);
                    count++;
                }
            });
            features.topic_similarity = count > 0 ? similaritySum / count : 0.5;
        } else {
            features.topic_similarity = 0.5;
        }

        return features;
    }

    // Add a training example (supervised learning)
    addTrainingExample(features, label, feedback = null) {
        const example = {
            features: features,
            label: label, // 0 = not recommended, 1 = recommended
            feedback: feedback, // optional user feedback (-1, 0, 1)
            timestamp: Date.now()
        };

        this.trainingData.push(example);
        
        // Keep only last 1000 examples to manage memory
        if (this.trainingData.length > 1000) {
            this.trainingData = this.trainingData.slice(-1000);
        }

        // Retrain model if we have enough data
        if (this.trainingData.length >= 10) {
            this.train();
        }

        this.saveTrainingData();
    }

    // Simple linear regression model for predictions
    predict(features) {
        if (!this.initialized) {
            this.initializeModel();
        }

        let prediction = 0;
        let totalWeight = 0;

        // Linear combination of features with weights
        this.featureNames.forEach(featureName => {
            const value = features[featureName] || 0;
            const weight = this.model.weights[featureName] || 0;
            prediction += weight * value;
            totalWeight += Math.abs(weight);
        });

        // Add bias
        prediction += this.model.biases.base || 0;

        // Normalize prediction to [0, 1] range
        prediction = this.sigmoid(prediction);
        
        return prediction;
    }

    // Sigmoid activation function
    sigmoid(x) {
        return 1 / (1 + Math.exp(-Math.max(Math.min(x, 10), -10)));
    }

    // Initialize model with random weights
    initializeModel() {
        this.featureNames.forEach(featureName => {
            this.model.weights[featureName] = (Math.random() - 0.5) * 0.1;
        });
        this.model.biases.base = (Math.random() - 0.5) * 0.1;
        this.initialized = true;
    }

    // Train the model using gradient descent
    train(epochs = 50, learningRate = 0.01) {
        if (this.trainingData.length < 5) {
            return; // Not enough data to train
        }

        if (!this.initialized) {
            this.initializeModel();
        }

        for (let epoch = 0; epoch < epochs; epoch++) {
            let totalError = 0;

            // Process each training example
            this.trainingData.forEach(example => {
                const prediction = this.predict(example.features);
                const error = example.label - prediction;

                totalError += Math.abs(error);

                // Update weights using gradient descent
                this.featureNames.forEach(featureName => {
                    const gradient = error * (example.features[featureName] || 0);
                    this.model.weights[featureName] = (this.model.weights[featureName] || 0) + 
                        learningRate * gradient;
                });

                // Update bias
                this.model.biases.base = (this.model.biases.base || 0) + learningRate * error;
            });

            // Early stopping if error is very small
            const avgError = totalError / this.trainingData.length;
            if (avgError < 0.01) {
                break;
            }
        }

        this.saveTrainingData();
    }

    // Generate personalized recommendations
    getRecommendations(userProgress, knowledgeBase, topN = 3) {
        if (!knowledgeBase || !knowledgeBase.topics || knowledgeBase.topics.length === 0) {
            return [];
        }

        const allTopics = knowledgeBase.topics;
        const exploredTopicIds = new Set(Object.keys(userProgress.topics || {}));
        
        // Score each unexplored or under-explored topic
        const recommendations = allTopics
            .filter(topic => {
                const explored = exploredTopicIds.has(topic.id);
                const questionsAsked = userProgress.topics[topic.id]?.questionsAsked || 0;
                // Recommend if not explored or if explored but with few questions (< 3)
                return !explored || questionsAsked < 3;
            })
            .map(topic => {
                // Extract features for this topic
                const features = this.extractFeatures(userProgress, knowledgeBase, topic.id);
                
                // Get prediction score
                const score = this.predict(features);
                
                // Add bonus for topics similar to explored ones
                const similarityBonus = features.topic_similarity * 0.2;
                const finalScore = score + similarityBonus;

                return {
                    topic: topic,
                    score: finalScore,
                    confidence: score,
                    reason: this.generateRecommendationReason(topic, features, exploredTopicIds.has(topic.id))
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, topN);

        return recommendations;
    }

    // Generate human-readable reason for recommendation
    generateRecommendationReason(topic, features, isExplored) {
        const reasons = [];
        
        if (features.topic_similarity > 0.6) {
            reasons.push('Similar to topics you\'ve explored');
        }
        if (features.topic_difficulty < 0.4) {
            reasons.push('Beginner-friendly');
        } else if (features.topic_difficulty > 0.7) {
            reasons.push('Matches your advancing level');
        }
        if (features.learning_path_sequence < 0.5) {
            reasons.push('Natural next step in your learning path');
        }
        if (isExplored && features.topic_frequency < 2) {
            reasons.push('You\'ve started this - continue learning');
        }
        
        return reasons.length > 0 ? reasons.join(', ') : 'Based on your learning pattern';
    }

    // Learn from user interaction (called when user asks about a topic)
    learnFromInteraction(userProgress, knowledgeBase, topicId, wasHelpful = true) {
        const features = this.extractFeatures(userProgress, knowledgeBase, topicId);
        const label = wasHelpful ? 1 : 0;
        
        this.addTrainingExample(features, label);
    }

    // Update model based on implicit feedback (time spent, questions asked)
    updateFromBehavior(userProgress, knowledgeBase) {
        Object.keys(userProgress.topics || {}).forEach(topicId => {
            const topicData = userProgress.topics[topicId];
            const questionsAsked = topicData.questionsAsked || 0;
            
            // If user asked multiple questions, they likely found it helpful
            if (questionsAsked >= 2) {
                const features = this.extractFeatures(userProgress, knowledgeBase, topicId);
                this.addTrainingExample(features, 1, null);
            }
        });
    }

    // Get learning insights based on the model
    getLearningInsights(userProgress, knowledgeBase) {
        const insights = {
            learningStyle: 'balanced',
            preferredDifficulty: 'beginner',
            recommendedNextSteps: [],
            strengths: [],
            areasForGrowth: []
        };

        // Analyze explored topics
        const exploredTopics = Object.keys(userProgress.topics || {}).map(id => {
            const topic = knowledgeBase.topics.find(t => t.id === id);
            return { id, topic, data: userProgress.topics[id] };
        }).filter(x => x.topic);

        if (exploredTopics.length === 0) {
            return insights;
        }

        // Determine learning style
        const categories = {};
        exploredTopics.forEach(({ topic }) => {
            categories[topic.category] = (categories[topic.category] || 0) + 1;
        });
        const topCategory = Object.keys(categories).reduce((a, b) => 
            categories[a] > categories[b] ? a : b, Object.keys(categories)[0]);
        
        insights.learningStyle = topCategory;

        // Determine preferred difficulty
        const difficulties = {};
        exploredTopics.forEach(({ topic }) => {
            difficulties[topic.difficulty] = (difficulties[topic.difficulty] || 0) + 1;
        });
        insights.preferredDifficulty = Object.keys(difficulties).reduce((a, b) => 
            difficulties[a] > difficulties[b] ? a : b, 'beginner');

        // Get recommendations
        insights.recommendedNextSteps = this.getRecommendations(userProgress, knowledgeBase, 3);

        // Identify strengths (topics with many questions)
        insights.strengths = exploredTopics
            .filter(({ data }) => data.questionsAsked >= 3)
            .map(({ topic }) => topic.title)
            .slice(0, 3);

        // Areas for growth (unexplored categories)
        const allCategories = new Set(knowledgeBase.topics.map(t => t.category));
        const exploredCategories = new Set(exploredTopics.map(({ topic }) => topic.category));
        insights.areasForGrowth = Array.from(allCategories)
            .filter(cat => !exploredCategories.has(cat))
            .map(cat => knowledgeBase.categories[cat] || cat);

        return insights;
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupervisedLearningEngine;
}
