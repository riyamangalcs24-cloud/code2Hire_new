const domains = require('../data/domains');

const buildInterviewQuestions = (topicName, categoryTitle) => ([
  {
    question: `What is ${topicName} and why is it important in ${categoryTitle}?`,
    answer: `${topicName} is a core concept inside ${categoryTitle}. In interviews, recruiters expect you to explain the idea, the use cases, trade-offs, and how you would apply it in a real problem or system.`,
  },
  {
    question: `How would you explain ${topicName} to a beginner in under two minutes?`,
    answer: `Start with a simple definition, then give one intuitive example, mention one common use case, and close with one limitation or trade-off. This shows both conceptual clarity and communication skill.`,
  },
  {
    question: `What are the common mistakes candidates make while answering ${topicName}-based questions?`,
    answer: `Common mistakes include memorized definitions, missing edge cases, no practical examples, and not comparing ${topicName} with adjacent concepts from the same category.`,
  },
]);

const buildLearningChecklist = (topicName) => ([
  `Understand the first-principles definition of ${topicName}.`,
  `Study 2 to 3 practical examples where ${topicName} appears in interviews or projects.`,
  `Write a concise revision note for ${topicName} in your own words.`,
  `Practice explaining ${topicName} aloud with one real-world analogy.`,
  `Solve at least one scenario-based question on ${topicName}.`,
]);

const buildResources = (topicName, domainTitle) => ([
  {
    title: `${topicName} fundamentals`,
    type: 'Concept revision',
    description: `A crisp theory pass for mastering the foundations of ${topicName} inside ${domainTitle}.`,
  },
  {
    title: `${topicName} interview drill`,
    type: 'Practice',
    description: `Targeted practice prompts and discussion points that simulate real interview follow-ups.`,
  },
  {
    title: `${topicName} mistakes checklist`,
    type: 'Revision',
    description: 'A last-minute revision checklist to avoid shallow or incomplete answers.',
  },
]);

const buildTopicDetail = (domain, category, topicName, topicIndex) => ({
  id: `${domain.id}-${category.id}-${topicIndex}`,
  slug: `${topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-|-$/g, ''),
  title: topicName,
  domainId: domain.id,
  domainTitle: domain.title,
  categoryId: category.id,
  categoryTitle: category.title,
  subtitle: `${topicName} interview preparation guide`,
  description: `Build a strong, interview-ready understanding of ${topicName} with structured notes, question patterns, and revision checkpoints.`,
  overview: [
    `${topicName} is one of the most important units inside ${category.title}. A strong answer should combine fundamentals, intuition, and applied reasoning.`,
    `In a production-ready prep workflow, you should move from concept clarity to problem framing, then to verbal explanation and interview simulations.`,
  ],
  keyConcepts: [
    `${topicName} fundamentals`,
    `${topicName} use cases`,
    `${topicName} trade-offs`,
    `${topicName} interview patterns`,
  ],
  interviewQuestions: buildInterviewQuestions(topicName, category.title),
  checklist: buildLearningChecklist(topicName),
  resources: buildResources(topicName, domain.title),
  estimatedDuration: '45-60 mins',
  difficulty: topicIndex % 3 === 0 ? 'Easy' : topicIndex % 3 === 1 ? 'Medium' : 'Hard',
});

const getTopicDetail = (domainId, categoryId, topicId) => {
  const domain = domains.find((entry) => entry.id === domainId);
  if (!domain) {
    return null;
  }

  const category = domain.categories.find((entry) => entry.id === categoryId);
  if (!category) {
    return null;
  }

  const numericIndex = Number(topicId);
  const topicName = Number.isInteger(numericIndex)
    ? category.topics[numericIndex]
    : category.topics.find((topic) => topic.toLowerCase().replace(/[^a-z0-9]+/g, '-') === topicId);

  if (!topicName) {
    return null;
  }

  const resolvedIndex = category.topics.findIndex((topic) => topic === topicName);
  return buildTopicDetail(domain, category, topicName, resolvedIndex);
};

module.exports = {
  getTopicDetail,
};