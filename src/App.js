import './App.css';
import { useTransition, Suspense, useReducer, useState, useEffect, useRef, useCallback } from 'react';

const Img = (data) => {
  try {
    const { state: { ms, data: { id, title, url: src } } } = data;
    return <>
      <h6>{id}[{ms}]:{title}</h6>
      <img src={src} height={300} />
    </>
  } catch { }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'photo':
      return { photo: action.payload };
    default: new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    photo: {
      ms: null,
      data: {
        id: null,
        title: null,
        url: null
      }
    },
    controller: null
  });
  const [isBusy, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState('');
  const onInputChange = useCallback(e => setInputValue(e.target.value))
  const inputRef = useRef();

  useEffect(() => {
    const abortController = new AbortController();
    //startTransition(() => {
    fetch(`http://localhost:8080/${inputRef.current.value}`, { signal: abortController.signal })
      .then(response => response.json())
      .then(payload => dispatch({ type: 'photo', payload }));
    //})
    return () => {
      if (abortController.signal && abortController.abort) {
        // abortController.abort();
      }
    }
  }, [inputValue])

  /* const inputChangeHandler = (e) => {
    if (e.target.value.length > 4) return;
    if (e.target.value.length === 0) return;
    e.preventDefault();
  } */

  return (
    <div className="App">
      <input type={'text'} ref={inputRef} value={inputValue} onChange={isBusy ? null : onInputChange} />
      <br />
      {isBusy
        ? <pre>Loading...</pre>
        : <Suspense><Img state={state.photo} /></Suspense>}
    </div>
  );
}

export default App;