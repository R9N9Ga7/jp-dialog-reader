import './Navigation.css';

type NavigationProps = {
  currentTopicIndex: number,
  currentDialogIndex: number,
  currentTopicContentSize: number,
  topics: string[],
  onSelect: (index: number) => void;
};

export const Navigation = ({
  currentTopicIndex,
  currentDialogIndex,
  currentTopicContentSize,
  topics,
  onSelect,
}: NavigationProps) => {
  const handleOnChange = (value: string) => {
    const parsedValue = parseInt(value);
    onSelect(isNaN(parsedValue) ? 0 : parsedValue);
  }

  return (
    <nav className='navigation'>
      <select
        value={currentTopicIndex}
        onChange={(e) => handleOnChange(e.target.value)}
        id='topic-selector'
      >
        {
          topics.map((topic, index) => (
            <option
              key={topic}
              value={index}
            >{topic}</option>)
          )
        }
      </select>
      <div>
        <span>Dialog {currentDialogIndex + 1} from {currentTopicContentSize}</span>
      </div>
    </nav>
  );
};
