import { Question } from './types';

export const questionsData: Question[] = [
  {
    id: '1',
    title: 'Tell me about yourself',
    category: 'Behavioral',
    difficulty: 'Medium',
    description: 'Give a brief overview of your professional background, skills, and what makes you unique.',
    instructions: 'Structure your response to highlight relevant experience, technical skills, and career progression. Keep it focused on professional aspects.',
    hints: [
      'Start with current role and responsibilities',
      'Highlight key technical skills and expertise',
      'Include relevant past experience',
      'Connect your background to the role'
    ]
  },
  {
    id: '2',
    title: 'What is your greatest strength?',
    category: 'Behavioral',
    difficulty: 'Medium',
    description: 'Discuss your key professional strengths with specific examples.',
    instructions: 'Choose a strength relevant to the role and support it with concrete examples from your experience.',
    hints: [
      'Focus on job-relevant strengths',
      'Provide specific examples',
      'Explain how it benefits the team/company',
      'Show how you actively use this strength'
    ]
  },
  {
    id: '3',
    title: 'What is your greatest weakness?',
    category: 'Behavioral',
    difficulty: 'Medium', 
    description: 'Discuss a professional weakness and how you are working to improve it.',
    instructions: 'Choose a genuine weakness but focus on your improvement steps and progress made.',
    hints: [
      'Be honest but strategic',
      'Focus on non-critical skills',
      'Describe specific improvement actions',
      'Show self-awareness and growth'
    ]
  },
  {
    id: '4',
    title: 'Why should we hire you?',
    category: 'Behavioral',
    difficulty: 'Hard',
    description: 'Make a compelling case for why you are the best candidate for the position.',
    instructions: 'Connect your skills and experience directly to the job requirements and company needs.',
    hints: [
      'Research company needs/challenges',
      'Match your skills to requirements',
      'Highlight unique value proposition',
      'Include quantifiable achievements'
    ]
  },
  {
    id: '5',
    title: 'Tell me about a time you showed leadership',
    category: 'Leadership',
    difficulty: 'Hard',
    description: 'Share an experience where you demonstrated leadership skills in a professional setting.',
    instructions: 'Use the STAR method to describe a specific situation where you led a team or initiative.',
    hints: [
      'Choose a significant project/initiative',
      'Explain your leadership approach',
      'Describe challenges overcome',
      'Share measurable results'
    ]
  },
  {
    id: '6',
    title: 'Tell me about a time you were successful on a team',
    category: 'Teamwork',
    difficulty: 'Medium',
    description: 'Share an experience where you collaborated effectively as part of a team to achieve success.',
    instructions: 'Use the STAR method to describe your role, team dynamics, and collective achievement.',
    hints: [
      'Focus on team collaboration',
      'Highlight your specific contributions',
      'Describe team challenges overcome',
      'Share team accomplishments'
    ]
  },
  {
    id: '7',
    title: 'What would your co-workers say about you?',
    category: 'Behavioral',
    difficulty: 'Medium',
    description: 'Describe how your colleagues perceive you as a team member and professional.',
    instructions: 'Focus on professional qualities and support with specific feedback you\'ve received.',
    hints: [
      'Include actual feedback received',
      'Focus on team collaboration',
      'Highlight professional qualities',
      'Give concrete examples'
    ]
  },
  {
    id: '8',
    title: 'Describe your most challenging project',
    category: 'Technical',
    difficulty: 'Hard',
    description: 'Detail a complex technical project you worked on and how you handled its challenges.',
    instructions: 'Use the STAR method to describe the project, technical challenges, your solutions, and results.',
    hints: [
      'Choose a technically complex project',
      'Explain key challenges faced',
      'Detail your problem-solving approach',
      'Share measurable outcomes'
    ]
  },
  {
    id: '9',
    title: 'Tell me about something you\'ve accomplished that you are proud of',
    category: 'Behavioral',
    difficulty: 'Medium',
    description: 'Share a significant professional achievement that demonstrates your capabilities.',
    instructions: 'Choose an accomplishment relevant to the role and explain why it was meaningful.',
    hints: [
      'Select a relevant achievement',
      'Explain the challenge/situation',
      'Detail your actions/approach',
      'Share concrete results'
    ]
  },
  {
    id: '10',
    title: 'What are your salary expectations?',
    category: 'Career',
    difficulty: 'Medium',
    description: 'Discuss your salary requirements based on your experience and market value.',
    instructions: 'Research market rates and prepare a range based on your experience and skills.',
    hints: [
      'Research industry standards',
      'Consider total compensation',
      'Prepare a reasonable range',
      'Be ready to negotiate'
    ]
  },
  {
    id: '11',
    title: 'What do you like to do outside of work?',
    category: 'Personal',
    difficulty: 'Easy',
    description: 'Share your interests and hobbies outside of your professional life.',
    instructions: 'Focus on activities that demonstrate positive qualities while keeping it authentic.',
    hints: [
      'Choose appropriate hobbies',
      'Connect to professional skills',
      'Show work-life balance',
      'Keep it genuine and brief'
    ]
  },
  {
    id: '12',
    title: 'Tell me about a time you had to manage conflicting priorities',
    category: 'Problem Solving',
    difficulty: 'Hard',
    description: 'Share how you handle competing deadlines and priorities effectively.',
    instructions: 'Use the STAR method to describe a specific situation where you balanced multiple priorities.',
    hints: [
      'Choose a relevant example',
      'Explain prioritization process',
      'Describe communication approach',
      'Share positive outcome'
    ]
  },
  {
    id: '13',
    title: 'Where do you see yourself in 5 years?',
    category: 'Career',
    difficulty: 'Medium',
    description: 'Discuss your career goals and professional development plans.',
    instructions: 'Focus on realistic growth within the company while showing ambition and commitment.',
    hints: [
      'Align with company growth',
      'Show reasonable ambition',
      'Include technical growth',
      'Demonstrate commitment'
    ]
  },
  {
    id: '14',
    title: 'Describe your leadership style',
    category: 'Leadership',
    difficulty: 'Hard',
    description: 'Explain your approach to leading teams and managing people.',
    instructions: 'Describe your leadership philosophy and provide examples of its effectiveness.',
    hints: [
      'Define your style clearly',
      'Provide specific examples',
      'Highlight successful outcomes',
      'Show adaptability'
    ]
  },
  {
    id: '15',
    title: 'Tell me about a time you failed or made a mistake',
    category: 'Problem Solving',
    difficulty: 'Hard',
    description: 'Share an experience where you faced failure and what you learned from it.',
    instructions: 'Focus on the learning experience and how you grew from the situation.',
    hints: [
      'Choose an appropriate example',
      'Own the mistake/failure',
      'Explain corrective actions',
      'Share lessons learned'
    ]
  },
  {
    id: '16',
    title: 'Tell me about a time you worked with a difficult person',
    category: 'Interpersonal',
    difficulty: 'Hard',
    description: 'Describe how you handled a challenging interpersonal situation professionally.',
    instructions: 'Use the STAR method to explain the situation and your approach to resolution.',
    hints: [
      'Focus on professional approach',
      'Highlight communication skills',
      'Show conflict resolution',
      'Emphasize positive outcome'
    ]
  },
  {
    id: '17',
    title: 'Tell me about a time you had to persuade someone',
    category: 'Communication',
    difficulty: 'Hard',
    description: 'Share an experience where you successfully convinced others to adopt your perspective.',
    instructions: 'Describe your approach to influence and how you built consensus.',
    hints: [
      'Choose significant example',
      'Explain your strategy',
      'Detail the process',
      'Show positive results'
    ]
  },
  {
    id: '18',
    title: 'Tell me about a time you disagreed with someone',
    category: 'Conflict Resolution',
    difficulty: 'Hard',
    description: 'Describe how you handled a professional disagreement constructively.',
    instructions: 'Focus on professional resolution and maintaining positive relationships.',
    hints: [
      'Choose appropriate disagreement',
      'Show respectful approach',
      'Explain resolution process',
      'Highlight positive outcome'
    ]
  },
  {
    id: '19',
    title: 'Tell me about a time you created a goal and achieved it',
    category: 'Achievement',
    difficulty: 'Medium',
    description: 'Share an experience of setting and achieving a significant professional goal.',
    instructions: 'Describe the goal-setting process and your path to achievement.',
    hints: [
      'Choose meaningful goal',
      'Explain planning process',
      'Detail execution steps',
      'Share concrete results'
    ]
  },
  {
    id: '20',
    title: 'Tell me about a time you surpassed people\'s expectations',
    category: 'Achievement',
    difficulty: 'Medium',
    description: 'Describe a situation where you delivered results beyond what was expected.',
    instructions: 'Focus on the extra effort and value you provided above requirements.',
    hints: [
      'Choose significant example',
      'Explain initial expectations',
      'Detail your approach',
      'Quantify results'
    ]
  },
  {
    id: '21',
    title: 'Tell me about a time you had to handle pressure',
    category: 'Stress Management',
    difficulty: 'Hard',
    description: 'Share how you effectively managed a high-pressure situation.',
    instructions: 'Describe your approach to staying calm and productive under pressure.',
    hints: [
      'Choose relevant situation',
      'Explain coping strategies',
      'Show problem-solving',
      'Highlight positive outcome'
    ]
  },
  {
    id: '22',
    title: 'Why were you laid off?',
    category: 'Career',
    difficulty: 'Hard',
    description: 'Explain the circumstances of your layoff professionally and positively.',
    instructions: 'Be honest while maintaining professionalism and focusing on the future.',
    hints: [
      'Be direct and honest',
      'Maintain professionalism',
      'Focus on learning/growth',
      'Show forward momentum'
    ]
  },
  {
    id: '23',
    title: 'What would your former boss say about you?',
    category: 'Behavioral',
    difficulty: 'Medium',
    description: 'Share how your previous supervisor would describe your work and character.',
    instructions: 'Focus on professional qualities and actual feedback received.',
    hints: [
      'Reference real feedback',
      'Highlight strengths',
      'Include growth areas',
      'Keep it professional'
    ]
  }
];