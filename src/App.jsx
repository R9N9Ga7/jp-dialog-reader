import { useEffect, useState } from 'react';
import './App.css'

import topicDailylife from './data/topic1.json';
import topicSchool from './data/topic2.json';
import topicTravel from './data/topic3.json';
import topicHealth from './data/topic4.json';
import topicEntertainment from './data/topic5.json';
import { Navigation } from './components/navigation';

const topics = [
  {
    title: 'Dailylife',
    content: topicDailylife,
  },
  {
    title: 'School',
    content: topicSchool,
  },
  {
    title: 'Travel',
    content: topicTravel,
  },
  {
    title: 'Health',
    content: topicHealth,
  },
  {
    title: 'Entertainment',
    content: topicEntertainment,
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function App() {
  const [isCaptionVisible, setIsCaptionVisible] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const [topicIndex, setTopicIndex] = useState(urlParams.get('topicIndex'));
  const [dialogIndex, setDialogIndex] = useState(urlParams.get('dialogIndex'));

  const getTopicIndex = () => clamp(parseInt(topicIndex ?? 0), 0, topics.length - 1);
  const getDialogIndex = () => parseInt(dialogIndex ?? 0);

  useEffect(() => {
    if (!dialogIndex || !topicIndex) {
      window.location.replace('?dialogIndex=0&topicIndex=0');
    }
  }, []);

  const getCurrentTopicContent = () => {
    const index = getDialogIndex();
    const topic = topics[getTopicIndex()];
    if (index < 0 || index >= topic.content.length) {
      return null;
    }
    return topic.content[index];
  }

  const toDialog = (dialogIndexDiffValue, toTopicIndex = -1) => {
    let nextDialogIndex = getDialogIndex() + dialogIndexDiffValue;
    toDialogByIndex(nextDialogIndex, toTopicIndex);
  };

  const toDialogByIndex = (nextDialogIndex, toTopicIndex = -1) => {
    const nextTopicIndex = toTopicIndex == -1 ? getTopicIndex() : clamp(toTopicIndex, 0, topics.length - 1);
    const currentTopicContentLength = topics[nextTopicIndex].content.length;

    if (nextDialogIndex < 0) {
      nextDialogIndex = currentTopicContentLength - 1;
    } else if (nextDialogIndex >= currentTopicContentLength) {
      nextDialogIndex = 0;
    }

    history.pushState({}, '', `?dialogIndex=${nextDialogIndex}&topicIndex=${nextTopicIndex}`);

    setTopicIndex(nextTopicIndex);
    setDialogIndex(nextDialogIndex);
  }

  return (
    <div className='content'>
      <Navigation topics={
        topics.map(value => value.title)}
        currentTopicIndex={getTopicIndex()}
        currentDialogIndex={getDialogIndex()}
        currentTopicContentSize={topics[getTopicIndex()].content.length}
        onSelect={(index) =>toDialogByIndex(0, index)}
      />
      <br/>
      {
        getCurrentTopicContent()?.utterances.map((value) => (
          <p
            className={value.speaker === 'A' ? 'a' : 'b'}
            key={value.utterance + value.speaker}
          >
            {value.speaker}: {
              value.tokens.map((pair, index) => (
                <span key={value.utterance + value.speaker + pair[0] + pair[1] + index} style={{ position: "relative", display: "inline-block" }}>
                  <span className='caption' style={{ display: isCaptionVisible ? 'block' : 'none' }}>{ pair[1] }</span>
                  <span>{ pair[0] }</span>
                </span>
              ))
            }
          </p>
        ))
      }
      <div className='controls'>
        <button onClick={() => toDialog(-1)}>&lt;</button>
        <button onClick={() => setIsCaptionVisible(!isCaptionVisible)}>{isCaptionVisible ? 'Hide Kanji Reading' : 'Show Kanji Reading'}</button>
        <button onClick={() => toDialog(1)}>&gt;</button>
      </div>
    </div>
  )
}

export default App
