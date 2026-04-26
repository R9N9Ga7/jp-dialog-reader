import { useState } from 'react';
import './App.css'

import topicDailylife from './data/topic1.json';
import topicSchool from './data/topic2.json';
import topicTravel from './data/topic3.json';
import topicHealth from './data/topic4.json';
import topicEntertainment from './data/topic5.json';

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
  const topicIndex = urlParams.get('topicIndex');
  const dialogIndex = urlParams.get('dialogIndex');

  const getTopicIndex = () => clamp(parseInt(topicIndex ?? 0), 0, topics.length - 1);
  const getDialogIndex = () => parseInt(dialogIndex ?? 0);

  if (!dialogIndex || !topicIndex) {
    window.location.replace('?dialogIndex=0&topicIndex=0');
  }

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
    const currentTopicContentLength = topics[getTopicIndex()].content.length;

    if (nextDialogIndex < 0) {
      nextDialogIndex = currentTopicContentLength - 1;
    } else if (nextDialogIndex >= currentTopicContentLength) {
      nextDialogIndex = 0;
    }

    const nextTopicIndex = toTopicIndex == -1 ? getTopicIndex() : clamp(toTopicIndex, 0, topics.length);
    window.location.href = `?dialogIndex=${nextDialogIndex}&topicIndex=${nextTopicIndex}`;
  }

  return (
    <div className='content'>
      <nav className='navigation'>
        <select
          value={getTopicIndex()}
          onChange={(e) =>toDialogByIndex(0, parseInt(e.target.value ?? 0))}
          id='topic-selector'
        >
          {
            topics.map((topic, index) => (
              <option
                key={topic.title}
                value={index}
              >{topic.title}</option>)
            )
          }
        </select>
        <div>
          <span>Dialog {getDialogIndex() + 1} from {topics[getTopicIndex()].content.length - 1}</span>
        </div>
      </nav>
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
