import './App.css'

import { Navigation } from './components/navigation';
import { useApp } from './useApp';

function App() {
  const {
    topics,
    currentTopicIndex,
    currentDialogIndex,
    isCaptionVisible,
    isDialogsLoading,
    toDialogByIndex,
    toDialog,
    changeCaptionVisibility,
    getCurrentDialogUtterances,
    getCurrentTopicContentSize,
  } = useApp();

  if (isDialogsLoading) {
    return (<div>Loading...</div>);
  }

  if (!getCurrentTopicContentSize()) {
    return (<div>Something went wrong!</div>);
  }

  return (
    <div className='content'>
      <Navigation topics={
        topics.map(value => value.title)}
        currentTopicIndex={currentTopicIndex}
        currentDialogIndex={currentDialogIndex}
        currentTopicContentSize={getCurrentTopicContentSize()}
        onSelect={(index) =>toDialogByIndex(0, index)}
      />
      <br/>
      {
        getCurrentDialogUtterances().map((value) => (
          <p
            className={value.speaker === 'A' ? 'a' : 'b'}
            key={value.utterance + value.speaker}
          >
            {value.speaker}: {
              value.tokens.map((pair, index) => (
                <span
                  key={value.utterance + value.speaker + pair[0] + pair[1] + index}
                  style={{ position: 'relative', display: 'inline-block' }}
                >
                  {
                    pair[1] !== pair[0] && /* TODO: fix it */ pair[1] != '?' ? (
                      <span
                        className='caption'
                        style={{ display: isCaptionVisible ? 'block' : 'none' }}
                      >{ pair[1] }</span>
                    ) : null
                  }
                  <span>{ pair[0] }</span>
                </span>
              ))
            }
          </p>
        ))
      }
      <div className='controls'>
        <button onClick={() => toDialog(-1)}>&lt;</button>
        <button onClick={changeCaptionVisibility}>
          {isCaptionVisible ? 'Hide Kanji Reading' : 'Show Kanji Reading'}
        </button>
        <button onClick={() => toDialog(1)}>&gt;</button>
      </div>
    </div>
  )
}

export default App
