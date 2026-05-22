const modules = import.meta.glob<{ default: Dialog[] }>('./data/*.json');

export type TokenPair = [
  kanji: string,
  reading: string,
];

export type Utterance = {
  turn_num: number,
  speaker: string,
  utterance: string,
  kana: string,
  tokens: TokenPair[],
};

export type Dialog = {
  topic_id: number,
  topic_name: string,
  dialogue_id: number,
  dialogue_length: number,
  utterances: Utterance[],
};

export type Topic = {
  title: string,
  path: string,
};

export const topics: Topic[] = [
  {
    title: 'Dailylife',
    path: './data/topic1.json',
  },
  {
    title: 'School',
    path: './data/topic2.json',
  },
  {
    title: 'Travel',
    path: './data/topic3.json',
  },
  {
    title: 'Health',
    path: './data/topic4.json',
  },
  {
    title: 'Entertainment',
    path: './data/topic5.json',
  },
];

export const loadDialogs = async (path: string): Promise<Dialog[]> => {
  const module = await modules[path]();
  return module.default;
}

export const getTopicDialogs = async (topicIndex: number): Promise<Dialog[]> => {
  if (topicIndex < 0 || topicIndex >= topics.length) {
    return [];
  }
  return await loadDialogs(topics[topicIndex].path);
}
