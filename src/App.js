import { useCallback, useEffect, useState } from "react";
import css from "./App.module.css";

export const App = () => {
  const [inputAnswers, setInputAnswers] = useState("");
  const [inpuQuestions, setInputQuestions] = useState("");
  const [collectAnswers, setCollectAnswers] = useState([]);
  const [randomIndex, setRandomIndex] = useState(0);
  const [randomOption, setRandomOption] = useState("");
  const [quizAnswer, setQuisAnswer] = useState("");
  const [quizInit, setQuizinit] = useState(true);
  const [isTrue, setIsTrue] = useState(false);
  const [isHintVisible, setHintVisibility] = useState(false);

  const [isQuizStarted, setQuizStarted] = useState(false);

  const changeAnswer = useCallback((e) => {
    setInputAnswers(e.target.value);
  }, []);
  const changeQuestion = useCallback((e) => {
    setInputQuestions(e.target.value);
  }, []);

  const addAnswer = useCallback(
    (questionText, answerText) => {
      setCollectAnswers([...collectAnswers, [questionText, answerText]]);
      setInputAnswers("");
      setInputQuestions("");
    },
    [collectAnswers]
  );

  const getQuizAnswer = useCallback((answer) => {
    setQuisAnswer(answer.target.value);
  }, []);

  const getRandomOption = useCallback(() => {
    const randomSize = Math.floor(Math.random() * collectAnswers.length);
    setIsTrue(false);
    setRandomIndex(randomSize);
    setRandomOption(collectAnswers?.[randomSize]?.[0]);
  }, [collectAnswers]);

  const checkAnswer = useCallback(
    (answer) => {
      if (answer !== collectAnswers[randomIndex][1]) {
        window.alert("неверно");
        setIsTrue(false);
        return false;
      }
      setQuisAnswer("");
      getRandomOption();
      setIsTrue(true);
      return true;
    },
    [collectAnswers, randomIndex, getRandomOption]
  );

  const beginQuiz = useCallback(() => {
    setQuizStarted(true);
  }, []);

  const handleRemove = useCallback(
    (id) => {
      const filteredItems = collectAnswers.filter((item) => item[0] !== id);

      setCollectAnswers(filteredItems);
    },
    [collectAnswers]
  );

  useEffect(() => {
    if (quizInit && isQuizStarted) {
      getRandomOption();
      setQuizinit(false);
    }
    if (isTrue) {
      getRandomOption();
      setIsTrue(false);
      setHintVisibility(false);
    }
  }, [getRandomOption, quizInit, isQuizStarted, isTrue]);

  return (
    <div className={css.wrapper}>
      <h1>Тестики</h1>
      {!isQuizStarted && (
        <>
          <p>Введи варианты</p>
          <div className={css.inputWrapper}>
            <input
              placeholder="по-русски"
              value={inpuQuestions}
              onChange={changeQuestion}
              className={css.inputItem}
            />
            <input
              placeholder="по-немецки"
              value={inputAnswers}
              onChange={changeAnswer}
              className={css.inputItem}
            />
          </div>
          <button onClick={() => addAnswer(inpuQuestions, inputAnswers)}>
            Сохранить вариант{" "}
          </button>
          <ul>
            {collectAnswers.map((item) => (
              <li key={item[0]}>
                <div>
                  <p>По-русски: {item[0]}</p>
                  <p>По-немецки: {item[1]}</p>
                  <button onClick={() => handleRemove(item[0])}>
                    Удалить вариант
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={() => beginQuiz()}>Запустить тест </button>
        </>
      )}
      {isQuizStarted && (
        <div className={css.inputWrapper}>
          <p>{randomOption}</p>
          <input
            value={quizAnswer}
            onChange={getQuizAnswer}
            placeholder="введи свой вариант"
            className={css.inputItem}
          />
          <div className={css.bottomBlockWrapper}>
            <button onClick={() => checkAnswer(quizAnswer)}>
              Проверить себя
            </button>
            <div className={css.hintWrapper}>
              <button onClick={() => setHintVisibility(true)}>Подсказка</button>
              {isHintVisible && <p>{collectAnswers[randomIndex][1]}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
