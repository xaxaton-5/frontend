// data/modules.ts

export interface TheoryContent {
  theoryPoints: string[];
  codeExample: string;
}

export interface TestContent {
  questions: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

export interface PracticeContent {
  task: string;
  codePlaceholder: string;
  solution: string;
  checkFunction: (code: string) => boolean;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  icon: string;
  xp: number;
  duration: number;
  type: 'theory' | 'test' | 'practice';
  completed: boolean;
  locked: boolean;
  content: TheoryContent | TestContent | PracticeContent;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  totalXP: number;
  progress: number;
  completed: boolean;
  locked: boolean;
  lessons: Lesson[];
  game?: {
    type: string;
    title: string;
    description: string;
  };
}

// Функции проверки для практических заданий
const checkFunctions = {
  // Модуль 1: Переменные
  checkFirstVariable: (code: string) => {
    return code.includes('myName') && code.includes('console.log') && code.includes('myName');
  },

  // Модуль 2: Циклы
  checkForLoop: (code: string) => {
    return (
      code.includes('for') &&
      code.includes('let i') &&
      code.includes('i <= 5') &&
      code.includes('i++') &&
      code.includes('console.log')
    );
  },

  checkWhileLoop: (code: string) => {
    return (
      code.includes('while') &&
      code.includes('i <= 5') &&
      code.includes('i++') &&
      code.includes('console.log')
    );
  },

  // Модуль 3: Условные операторы
  checkAge: (code: string) => {
    return (
      code.includes('age') &&
      code.includes('if') &&
      code.includes('else') &&
      code.includes('console.log')
    );
  },

  checkScore: (code: string) => {
    return (
      code.includes('score') &&
      code.includes('if') &&
      code.includes('else if') &&
      code.includes('else') &&
      code.includes('console.log')
    );
  },
};

// Модуль 1: Переменные и Типы данных
export const module1: Module = {
  id: 1,
  title: '🚀 Модуль 1: Переменные и Типы данных',
  description: 'Научись создавать свои первые переменные!',
  totalXP: 500,
  progress: 0,
  completed: false,
  locked: false,
  game: {
    type: 'variables',
    title: '🎮 Собери код!',
    description: 'Помоги собрать правильный код',
  },
  lessons: [
    {
      id: 1,
      title: 'Что такое переменная?',
      description: 'Узнай, как хранить информацию в компьютере',
      icon: '📦',
      xp: 50,
      duration: 10,
      type: 'theory',
      completed: false,
      locked: false,
      content: {
        theoryPoints: [
          'Переменная - это контейнер для данных',
          'У каждой переменной есть имя и значение',
          'Типы данных: числа, текст, правда/ложь',
          'Имя переменной должно быть уникальным',
          'Переменные можно изменять в процессе работы программы',
        ],
        codeExample: `// Создаем переменную
let age = 10;
let name = "Маша";
let isCoder = true;

console.log("Привет, " + name);
console.log("Тебе " + age + " лет");`,
      },
    },
    {
      id: 2,
      title: 'Тест: Переменные',
      description: 'Проверь свои знания о переменных',
      icon: '📝',
      xp: 100,
      duration: 15,
      type: 'test',
      completed: false,
      locked: true,
      content: {
        questions: [
          {
            question: 'Как объявить переменную в JavaScript?',
            options: ['var x = 5;', 'let x = 5;', 'const x = 5;', 'Все варианты верны'],
            correct: 3,
          },
          {
            question: 'Что выведет console.log(typeof 42)?',
            options: ['"number"', '"string"', '"boolean"', '"object"'],
            correct: 0,
          },
          {
            question: 'Какое значение у переменной после let x = 5; x = "hello";?',
            options: ['5', '"hello"', 'undefined', 'null'],
            correct: 1,
          },
          {
            question: 'Что такое camelCase?',
            options: [
              'Стиль написания кода',
              'Способ именования переменных',
              'Тип данных',
              'Название языка программирования',
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 3,
      title: 'Создаём первую переменную',
      description: 'Напиши код, который создаёт переменную',
      icon: '✏️',
      xp: 150,
      duration: 20,
      type: 'practice',
      completed: false,
      locked: true,
      content: {
        task: 'Создай переменную "myName" с твоим именем и выведи её на экран с помощью console.log()',
        codePlaceholder: '// Напиши код здесь\nlet myName = "Твоё имя";\nconsole.log(myName);',
        solution: 'let myName = "Анна";\nconsole.log(myName);',
        checkFunction: checkFunctions.checkFirstVariable,
      },
    },
  ],
};

// Модуль 2: Циклы
export const module2: Module = {
  id: 2,
  title: '🔄 Модуль 2: Циклы',
  description: 'Научи компьютер повторять действия!',
  totalXP: 800,
  progress: 0,
  completed: false,
  locked: true,
  game: {
    type: 'loops',
    title: '🔄 Повторитель!',
    description: 'Помоги роботу выполнить цикл',
  },
  lessons: [
    {
      id: 1,
      title: 'Что такое цикл?',
      description: 'Узнай, как заставить код повторяться',
      icon: '🔄',
      xp: 50,
      duration: 12,
      type: 'theory',
      completed: false,
      locked: true,
      content: {
        theoryPoints: [
          'Циклы помогают повторять действия',
          'Цикл for - когда знаешь сколько раз',
          'Цикл while - когда нужно повторять пока условие верно',
          'Цикл for...of - для перебора массивов',
          'Важно не создавать бесконечные циклы',
        ],
        codeExample: `// Цикл for
for(let i = 1; i <= 5; i++) {
  console.log("Считаем: " + i);
}

// Цикл while
let count = 0;
while(count < 3) {
  console.log("Повторяем!");
  count++;
}`,
      },
    },
    {
      id: 2,
      title: 'Тест: Циклы',
      description: 'Проверь знания о циклах',
      icon: '📝',
      xp: 100,
      duration: 15,
      type: 'test',
      completed: false,
      locked: true,
      content: {
        questions: [
          {
            question: 'Какой цикл используется, когда известно количество повторений?',
            options: ['while', 'for', 'do...while', 'for...in'],
            correct: 1,
          },
          {
            question: 'Что произойдёт при бесконечном цикле?',
            options: [
              'Программа завершится',
              'Компьютер зависнет',
              'Браузер может зависнуть',
              'Ничего не произойдёт',
            ],
            correct: 2,
          },
          {
            question: 'Сколько раз выполнится цикл: for(let i = 0; i < 3; i++)?',
            options: ['0', '1', '2', '3'],
            correct: 3,
          },
          {
            question: 'Как остановить бесконечный цикл?',
            options: ['Ctrl+C', 'break', 'continue', 'return'],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 3,
      title: 'Создаём цикл for',
      description: 'Напиши цикл, который выводит числа от 1 до 5',
      icon: '✏️',
      xp: 150,
      duration: 20,
      type: 'practice',
      completed: false,
      locked: true,
      content: {
        task: 'Создай цикл for, который выводит числа от 1 до 5. Каждое число должно быть на новой строке.',
        codePlaceholder: '// Напиши код здесь\nfor(let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
        solution: 'for(let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
        checkFunction: checkFunctions.checkForLoop,
      },
    },
    {
      id: 4,
      title: 'Создаём цикл while',
      description: 'Напиши цикл, который выводит числа от 1 до 5',
      icon: '✏️',
      xp: 150,
      duration: 20,
      type: 'practice',
      completed: false,
      locked: true,
      content: {
        task: 'Создай цикл while, который выводит числа от 1 до 5. Каждое число должно быть на новой строке.',
        codePlaceholder:
          '// Напиши код здесь\nlet i = 1;\nwhile(i <= 5) {\n  console.log(i);\n  i++;\n}',
        solution: 'let i = 1;\nwhile(i <= 5) {\n  console.log(i);\n  i++;\n}',
        checkFunction: checkFunctions.checkWhileLoop,
      },
    },
  ],
};

// Модуль 3: Условные операторы
export const module3: Module = {
  id: 3,
  title: '🎯 Модуль 3: Условные операторы',
  description: 'Научи код принимать решения!',
  totalXP: 900,
  progress: 0,
  completed: false,
  locked: true,
  lessons: [
    {
      id: 1,
      title: 'Что такое if/else?',
      description: 'Узнай, как заставить код принимать решения',
      icon: '🤔',
      xp: 50,
      duration: 12,
      type: 'theory',
      completed: false,
      locked: true,
      content: {
        theoryPoints: [
          'Условные операторы позволяют выполнять разный код в зависимости от условий',
          'if - выполняется, если условие истинно',
          'else - выполняется, если условие ложно',
          'else if - позволяет проверить несколько условий',
          'Сравнение: == (равно), === (строго равно), != (не равно), > (больше), < (меньше)',
        ],
        codeExample: `// Простой if
let age = 10;
if(age >= 18) {
  console.log("Взрослый");
} else {
  console.log("Ребёнок");
}

// if/else if/else
let score = 85;
if(score >= 90) {
  console.log("Отлично!");
} else if(score >= 70) {
  console.log("Хорошо!");
} else {
  console.log("Нужно подтянуть знания");
}`,
      },
    },
    {
      id: 2,
      title: 'Тест: Условные операторы',
      description: 'Проверь знания об if/else',
      icon: '📝',
      xp: 100,
      duration: 15,
      type: 'test',
      completed: false,
      locked: true,
      content: {
        questions: [
          {
            question:
              'Что выведет код: if(5 > 3) { console.log("Да"); } else { console.log("Нет"); }',
            options: ['"Да"', '"Нет"', 'Ничего', 'Ошибка'],
            correct: 0,
          },
          {
            question: 'Как проверить, что переменная x равна 10?',
            options: ['x = 10', 'x == 10', 'x === 10', 'x != 10'],
            correct: 1,
          },
          {
            question:
              'Что выведет код: let x = 5; if(x > 10) { console.log("Больше"); } else if(x > 3) { console.log("Средний"); } else { console.log("Меньше"); }',
            options: ['"Больше"', '"Средний"', '"Меньше"', 'Ничего'],
            correct: 1,
          },
          {
            question: 'Какой оператор используется для "строго равно"?',
            options: ['=', '==', '===', '!='],
            correct: 2,
          },
          {
            question:
              'Что выведет код: let age = 15; if(age >= 18) { console.log("Взрослый"); } else { console.log("Ребёнок"); }',
            options: ['"Взрослый"', '"Ребёнок"', 'Ничего', 'Ошибка'],
            correct: 1,
          },
        ],
      },
    },
    {
      id: 3,
      title: 'Проверка возраста',
      description: 'Напиши код, который проверяет возраст',
      icon: '✏️',
      xp: 150,
      duration: 20,
      type: 'practice',
      completed: false,
      locked: true,
      content: {
        task: 'Создай переменную "age" с твоим возрастом. Если возраст больше или равен 18, выведи "Ты взрослый!", иначе выведи "Ты ещё ребёнок!"',
        codePlaceholder:
          '// Напиши код здесь\nlet age = 15;\nif(age >= 18) {\n  console.log("Ты взрослый!");\n} else {\n  console.log("Ты ещё ребёнок!");\n}',
        solution:
          'let age = 15;\nif(age >= 18) {\n  console.log("Ты взрослый!");\n} else {\n  console.log("Ты ещё ребёнок!");\n}',
        checkFunction: checkFunctions.checkAge,
      },
    },
    {
      id: 4,
      title: 'Оценка по баллам',
      description: 'Напиши код, который выставляет оценку по баллам',
      icon: '✏️',
      xp: 150,
      duration: 20,
      type: 'practice',
      completed: false,
      locked: true,
      content: {
        task: 'Создай переменную "score" с баллами (от 0 до 100). Если баллы >= 90 - "Отлично!", >= 70 - "Хорошо!", >= 50 - "Удовлетворительно!", иначе - "Нужно учиться!"',
        codePlaceholder:
          '// Напиши код здесь\nlet score = 85;\nif(score >= 90) {\n  console.log("Отлично!");\n} else if(score >= 70) {\n  console.log("Хорошо!");\n} else if(score >= 50) {\n  console.log("Удовлетворительно!");\n} else {\n  console.log("Нужно учиться!");\n}',
        solution:
          'let score = 85;\nif(score >= 90) {\n  console.log("Отлично!");\n} else if(score >= 70) {\n  console.log("Хорошо!");\n} else if(score >= 50) {\n  console.log("Удовлетворительно!");\n} else {\n  console.log("Нужно учиться!");\n}',
        checkFunction: checkFunctions.checkScore,
      },
    },
  ],
};

// Экспорт всех модулей
export const modules: Module[] = [module1, module2, module3];

// Вспомогательные функции для работы с модулями
export const getModuleById = (id: number): Module | undefined => {
  return modules.find((m) => m.id === id);
};

export const getLessonById = (moduleId: number, lessonId: number): Lesson | undefined => {
  const module = getModuleById(moduleId);
  return module?.lessons.find((l) => l.id === lessonId);
};

export const updateModuleProgress = (module: Module): void => {
  const completedCount = module.lessons.filter((l) => l.completed).length;
  module.progress = Math.round((completedCount / module.lessons.length) * 100);

  if (completedCount === module.lessons.length && !module.completed) {
    module.completed = true;
    const nextModule = modules.find((m) => m.id === module.id + 1);
    if (nextModule) {
      nextModule.locked = false;
      if (nextModule.lessons[0]) {
        nextModule.lessons[0].locked = false;
      }
    }
  }
};

export const unlockNextLesson = (module: Module, currentLessonId: number): void => {
  const currentIndex = module.lessons.findIndex((l) => l.id === currentLessonId);
  const nextLesson = module.lessons[currentIndex + 1];
  if (nextLesson) {
    nextLesson.locked = false;
  }
  updateModuleProgress(module);
};

export const getTotalProgress = (): number => {
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0,
  );
  return totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
};
