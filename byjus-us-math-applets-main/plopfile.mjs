export default async function (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  await plop.load('plop-action-eslint')

  plop.setGenerator('component', {
    description: 'Component Scaffolding',
    prompts: [
      {
        type: 'list',
        name: 'category',
        message: 'Which Atomic design level?',
        choices: ['atoms', 'molecules', 'organisms', 'templates', 'applets'],
        default: 0,
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is the component name?',
      },
    ],
    actions: (data) =>
      data.category === 'applets'
        ? [
            {
              type: 'addMany',
              destination: 'src/applets/{{name}}',
              templateFiles: '.templates/applet/*.hbs',
              base: '.templates/applet',
            },
          ]
        : [
            {
              type: 'addMany',
              destination: 'src/{{category}}/{{pascalCase name}}',
              templateFiles: '.templates/component/*.hbs',
              base: '.templates/component',
            },
          ],
  })
}
