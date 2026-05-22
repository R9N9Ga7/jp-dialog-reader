import { useEffect, useState } from 'react';
import { Dialog, getTopicDialogs, topics, Utterance } from './topics';
import { clamp, parseIntOrDefault } from './shared/utils';
import { useNavigate, useSearchParams } from 'react-router';

export const useApp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const topicIndexParam = searchParams.get('topicIndex');
  const dialogIndexParam = searchParams.get('dialogIndex');

  const [isCaptionVisible, setIsCaptionVisible] = useState(false);
  const [currentTopicIndex, setCurrentTopicIndex] = useState<number>(0);
  const [currentDialogIndex, setCurrentDialogIndex] = useState<number>(0);
  const [currentTopicDialogs, setCurrentTopicDialogs] = useState<Dialog[]>([]);
  const [isDialogsLoading, setIsDialogsLoading] = useState<boolean>(true);

  useEffect(() => {
    setCurrentTopicIndex(clamp(parseIntOrDefault(topicIndexParam), 0, topics.length - 1));
  }, [topicIndexParam]);

  useEffect(() => {
    setCurrentDialogIndex(
      clamp(parseIntOrDefault(dialogIndexParam), 0, Math.max(0, currentTopicDialogs.length - 1)),
    );
  }, [dialogIndexParam, currentTopicDialogs]);

  useEffect(() => {
    (async () => {
      setIsDialogsLoading(true);
      const dialogs = await getTopicDialogs(currentTopicIndex);
      setCurrentTopicDialogs(dialogs);
      setCurrentDialogIndex(clamp(parseIntOrDefault(dialogIndexParam), 0, dialogs.length - 1));
      setIsDialogsLoading(false);
    })();
  }, [currentTopicIndex]);

  const toDialog = (dialogIndexDiffValue: number, toTopicIndex: number = -1) => {
    const nextDialogIndex = currentDialogIndex + dialogIndexDiffValue;
    toDialogByIndex(nextDialogIndex, toTopicIndex);
  };

  const toDialogByIndex = (nextDialogIndex: number, toTopicIndex: number = -1) => {
    const nextTopicIndex = toTopicIndex == -1 ? currentTopicIndex : clamp(toTopicIndex, 0, Math.max(0, topics.length - 1));
    if (nextDialogIndex < 0) {
      nextDialogIndex = Math.max(0, currentTopicDialogs.length - 1);
    } else if (nextDialogIndex >= currentTopicDialogs.length) {
      nextDialogIndex = 0;
    }

    navigate(`?topicIndex=${nextTopicIndex}&dialogIndex=${nextDialogIndex}`);

    setCurrentTopicIndex(nextTopicIndex);
    setCurrentDialogIndex(nextDialogIndex);
  }

  const getCurrentDialogUtterances = (): Utterance[] => {
    if (currentDialogIndex < 0 || currentDialogIndex >= currentTopicDialogs.length) {
      return [];
    }
    return currentTopicDialogs[currentDialogIndex].utterances;
  };

  const getCurrentTopicContentSize = () => currentTopicDialogs.length;

  const changeCaptionVisibility = () => setIsCaptionVisible(!isCaptionVisible);

  return {
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
  };
};
