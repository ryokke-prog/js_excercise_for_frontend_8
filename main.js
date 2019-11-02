// 解答例 (色々な実装方法があるため、この実装はあくまでも1つの実装例として考えること。)

(() => {
  // 利用するAPI情報元
  //   - 本サイト : https://opentdb.com/
  //   - 利用するAPI : https://opentdb.com/api.php?amount=10&type=multiple

  const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

  // 「gameState」オブジェクトを作る
  // - クイズアプリのデータ管理用オブジェクト
  // - 保持する情報
  //   - quizzes : fetchで取得したクイズデータの配列(resutls)を保持する
  //   - currentIndex : 現在何問目のクイズに取り組んでいるのかをインデックス番号で保持する
  //   - numberOfCorrects : 正答数を保持するう
  const gameState = {
    quizzez: [],
    currentIndex: 0,
    numberOfCorrects: 0
  };

  // HTMLのid値がセットされているDOMを取得する
  const questionElement = document.getElementById('question');
  const answersElement = document.getElementById('answers');
  const resultElement = document.getElementById('result');
  const restartButtonElement = document.getElementById('restart-button');

  // ページの読み込みが完了したらクイズ情報を取得する
  window.onload = function () {
    fetchQuizData();
  };

  // 「Restart」ボタンをクリックしたら再度クイズデータを取得する
  restartButtonElement.addEventListener('click', (event) => {
    fetchQuizData();
  });


  // `fetchQuizData関数`を実装する
  // - 実現したいこと
  //   - Webページ上の表示をリセットする
  //     - id属性値が 'question' の要素に「Now loading...」という文字列をセットする
  //     - id属性値が 'result' の要素に空文字列をセットする (Restartボタンでクイズ2回以上繰り返す時用)
  //     - id属性値が 'restart-button' の要素を非表示にする (Restartボタンでクイズ2回以上繰り返す時用)
  //   - クイズ取得~取得後の流れ
  //     1. API_URLとFetch API(fetchメソッド)を使ってAPI経由でデータを取得する
  //       - https://developer.mozilla.org/ja/docs/Web/API/WindowOrWorkerGlobalScope/fetch
  //     2. fetchメソッドで取得したResponseデータからJSON形式のデータをオブジェクトに変換して次のthenメソッドにデータを渡す
  //       - https://developer.mozilla.org/ja/docs/Web/API/Response
  //     3. 2で取得したデータの中にresultsプロパティ(配列)があり、その中には10件のクイズデータがある。
  //        その10件のデータを利用してクイズの出題・回答を出来るようにする。(詳しくは完成形の画像を参照)
  // - 引数
  //   - 無し
  // - 戻り値
  //   - 無し
  function fetchQuizData() {
    questionElement.textContent = 'Now loading...';
    resultElement.textContent = '';
    restartButtonElement.style.display = 'none';

    fetch(API_URL)
      .then(Response => {
        return Response.json();
      })
      .then((data) => {
        gameState.quizzez = data.results;
        gameState.currentIndex = 0;
        gameState.numberOfCorrects = 0;

        setNextQuiz();
      });
  }

  // setNextQuiz関数を実装する
  // - 実現したいこと
  //   - 表示要素をリセットする
  //     - 問題文を空にする
  //     - 解答一覧を全て消す
  //   - 条件に応じて、次の問題の表示 or 結果を表示する
  //     - 次の問題がまだ存在すれば次の問題をセットする
  //     - 直前に解答したのが最後の問題であれば結果を表示する(finishQuiz関数を実行する)
  // - 引数
  //   - 無し
  // - 戻り値
  //   - 無し
  function setNextQuiz() {
    questionElement.textContent = '';
    removeAllAnswers()

    if (gameState.currentIndex < gameState.quizzez.length) {
      const currentQuiz = gameState.quizzez[gameState.currentIndex];
      makeQuiz(currentQuiz);
    } else {
      finishQuiz();
    }
  }

  // finishQuiz関数を実装する
  // - 実現したいこと
  //   - 正答数を表示する(例: 4問正解したばあいは 「4/10 corrects」と表示する)
  //   - 「Restart」ボタンを表示する
  // - 引数
  //   - 無し
  // - 戻り値
  //   - 無し
  function finishQuiz() {
    resultElement.textContent =
      gameState.numberOfCorrects + '/' + gameState.quizzez.length + ' cottects';
    restartButtonElement.style.display = 'block';
  }

  // removeAllAnswers関数を実装する
  // - 実現したいこと
  //   - 解答を全て削除する
  // - 引数
  //   - 無し
  // - 戻り値
  //   - 無し
  function removeAllAnswers() {
    while (answersElement.firstChild) {
      answersElement.removeChild(answersElement.firstChild);
    }
  }

  // makeQuiz関数を実装する
  // - 実現したいこと
  //   - クイズデータを元にWebページ上に問題と解答リストを表示する
  //   - 解答をクリックしたら、正解・不正解のチェックをする
  //     - 正解の場合
  //       - 「gameState」オブジェクトで管理している正答数プロパティをインクリメントする
  //       - 「Correct answer!!」とアラート表示する
  //     - 不正解の場合
  //       - 「Wrong answer... (The correct answer is "実際の答えを埋め込む")」とアラート表示する
  //   - 回答する度に「gameState」オブジェクトで管理している、問題数プロパティをインクリメントする
  //   - setNextQuiz関数を実行して次の問題をセットする(最後の問題の場合は結果を表示する。)
  // - 引数
  //   - オブジェクト(クイズデータ1件)
  // - 戻り値無し
  //   - 無し
  function makeQuiz(quiz) {
    const margedAnswers = [quiz.correct_answer, ...quiz.incorrect_answers];
    const shuffledAnswers = shuffle(margedAnswers);
    // ここでシャッフルした四択が配列でreturnされたはず。

    questionElement.textContent = unescapeHTML(quiz.question);

    shuffledAnswers.forEach(answer => {
      const liElement = document.createElement('li');
      liElement.textContent = unescapeHTML(answer);
      answersElement.appendChild(liElement);

      liElement.addEventListener('click', (event) => {
        const correctAnswer = unescapeHTML(quiz.correct_answer);
        if (event.target.textContent === correctAnswer) {
          gameState.numberOfCorrects++;
          alert('Correct answer!!');
        } else {
          alert('Wrong answer... (The correct answer is' + correctAnswer);
        }

        gameState.currentIndex++;
        setNextQuiz();
      });
    });
  }

  // quizオブジェクトの中にあるcorrect_answer, incorrect_answersを結合して
  // 正解・不正解の解答をシャッフルする。


  // `shuffle関数` を実装する
  // - 実現したいこと
  //   - 引数で受け取った配列内の値をシャッフルする
  //   - 引数で渡された配列を上書きしないように、シャッフルする配列はコピーしたものを使う
  //   - シャッフルの機能を実現するのに参考になるサイト
  //     - https://qiita.com/artistan/items/9eb9a0fb14f4ec3a8764
  // - 引数
  //   - array : 配列
  // - 戻り値
  //   - shffuledArray : シャッフル後の配列(引数の配列とは別の配列であることに注意する)
  function shuffle(array) {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i >= 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[rand]] = [shuffledArray[rand], shuffledArray[i]];
    }

    return shuffledArray;
  }


  // unescapeHTML関数を実装する
  // - 実現したいこと
  //   - &やクオーテーションマークなどが特殊文字としてセットされているので、
  //     人間が読みやすい形式に変換した文字列を取得する(エスケープ文字を元に戻す)
  //     参考にしたサイト : http://blog.tojiru.net/article/211339637.html
  // - 引数
  //   - 文字列
  // - 戻り値
  //   - 文字列
  function unescapeHTML(str) {
    const div = document.createElement("div");
    div.innerHTML = str.replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/ /g, "&nbsp;")
      .replace(/\r/g, "&#13;")
      .replace(/\n/g, "&#10;");

    return div.textContent || div.innerText;
  }
})();
