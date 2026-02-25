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
    <div>
      <div>
        {
          topics.map((topic, index) => (
            <button
              key={topic.title}
              onClick={() => toDialogByIndex(0, index)}
              className={index === getTopicIndex() ? 'active' : ''}
            >{topic.title}</button>)
          )
        }
      </div>
      <br/>
      <div>
        <span>{dialogIndex} from {topics[getTopicIndex()].content.length - 1}</span>
      </div>
      <br/>
      <div>
        <button onClick={() => toDialog(-1)}>Prev</button>
        <button onClick={() => toDialog(1)}>Next</button>
      </div>
      {
        getCurrentTopicContent()?.utterances.map((value) => (
          <p
            className={value.speaker === 'A' ? 'a' : 'b'}
            key={value.utterance + value.speaker}
          >
            {value.speaker}: {value.utterance}
          </p>
        ))
      }
    </div>
  )
}

export default App
