
<h3 align="center">Dependencies</h3>

This project uses the following dependencies:

- `next.js` - v9.3 or above required for **API Routes** and new [**new data fetching method**](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering).
- `react` - v16.8 or above required for **react hooks**.
- `react-dom` - v16.8 or above.
- `swr` - required for state management, may be replaced with `react-query`
- `mongodb` - may be replaced by `mongoose`.
- `passport`, `passport-local` - required for authentication.
- `next-connect` - recommended if you want to use Express/Connect middleware and easier method routing.
- `next-session`, `connect-mongo` - required for session, may be replaced with other session libraries such as `cookie-session`, `next-iron-session`, or `express-session` (`express-session` is observed not to work properly on Next.js 11+).
- `bcryptjs` - optional, may be replaced with any password-hashing library. `argon2` recommended.
- `validator` - optional but recommended, to validate email.
- `ajv` - optional but recommended, to validate request body.
- `multer` - may be replaced with any middleware that handles `multipart/form-data`
- `cloudinary` - optional, **only if** you are using [Cloudinary](https://cloudinary.com) for image upload.
- several other optional dependencies for cosmetic purposes.
- `nodemailer` - optional, **only if** you use it for email. It is recommended to use 3rd party services like [Mailgun](https://www.mailgun.com/), [AWS SES](https://aws.amazon.com/ses/), etc. instead.

<h3 align="center">Environmental variables</h3>

Environmental variables in this project include:

- `MONGODB_URI` The MongoDB Connection String (with credentials and database name)
- `WEB_URI` The _URL_ of your web app.
- `CLOUDINARY_URL` (optional, Cloudinary **only**) Cloudinary environment variable for configuration. See [this](https://cloudinary.com/documentation/node_integration#configuration).
- `NODEMAILER_CONFIG` (optional, if using nodemailer **only**) JSON stringified nodemailer config. eg. `{"service":"Gmail","auth":{"user":"hoangvvo.02@gmail.com","pass":"aHR0cHM6Ly95b3V0dS5iZS9kUXc0dzlXZ1hjUQ=="}}`

<h3 align="center">Development</h3>

Start the development server by running `yarn dev` or `npm run dev`. Getting started by create a `.env.local` file with the above variables. See [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables).

```
{
  "singleQuote": true, 
  // 모든 문장의 마지막에 세미콜론(;)을 추가합니다.
  "semi": true,
  // 화살표 함수에서 괄호를 항상 포함시킵니다. 예: (x) => x
  "arrowParens": "always",
  // 여러 줄을 사용하여 객체, 배열, 함수 등을 정의할 때, 마지막 항목 또는 매개변수 다음에도 쉼표를 붙입니다.
  "trailingComma": "all",
  // JSX 요소의 닫는 꺾쇠 괄호 '>'를 다음 줄로 줄바꿈합니다.
  "jsxBracketSameLine": false,
  // 파일의 끝에 개행 문자를 추가합니다.
  "endOfLine": "lf",
  // 최대 줄 길이를 80으로 제한합니다.
  "printWidth": 80,
  // 탭 대신 공백을 사용하여 들여쓰기합니다.
  "useTabs": false,
  // 들여쓰기 너비를 2로 설정합니다.
  "tabWidth": 2
}

```

