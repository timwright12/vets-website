import React, { useMemo } from 'react';
import ReactWebChat, {
  createDirectLine,
  createStore,
} from 'botframework-webchat';

const BotActivityDecorator = ({ children }) => {
  return (
    <div className="botActivityDecorator">
      <ul className="botActivityDecorator__buttonBar">
        <li>
          <button className="botActivityDecorator__button">yes</button>
        </li>
        <li>
          <button className="botActivityDecorator__button">no</button>
        </li>
      </ul>
      <div className="botActivityDecorator__content">{children}</div>
    </div>
  );
};

const activityMiddleware = () => next => (...setupArgs) => {
  const [card] = setupArgs;
  if (card.activity.from.role === 'bot') {
    return (...renderArgs) => (
      <BotActivityDecorator
        activityID={card.activity.id}
        key={card.activity.id}
      >
        {next(card)(...renderArgs)}
      </BotActivityDecorator>
    );
  }
  return next(...setupArgs);
};

export default function App() {
  const store = useMemo(() => createStore(), []);
  const directLine = useMemo(
    () =>
      createDirectLine({
        domain:
          'https://northamerica.directline.botframework.com/v3/directline',
        token:
          'ew0KICAiYWxnIjogIlJTMjU2IiwNCiAgImtpZCI6ICJsY0oxTXFpNkdKYXdCZEw5Y0dieEt5S1R6OE0iLA0KICAieDV0IjogImxjSjFNcWk2R0phd0JkTDljR2J4S3lLVHo4TSIsDQogICJ0eXAiOiAiSldUIg0KfQ.ew0KICAiYm90IjogImF6Y2N0b2xhYmhlYWx0aGJvdC1kamVvZXhjIiwNCiAgInNpdGUiOiAiUHh4SzRLa083aVkiLA0KICAiY29udiI6ICJCcDVYUDc5aFRwZ0RzR3NxQWZibGQ1LW8iLA0KICAibmJmIjogMTYxMzU4MTM4OCwNCiAgImV4cCI6IDE2MTM1ODQ5ODgsDQogICJpc3MiOiAiaHR0cHM6Ly9kaXJlY3RsaW5lLmJvdGZyYW1ld29yay5jb20vIiwNCiAgImF1ZCI6ICJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8iDQp9.y3T08F4cLmvThvTtFGqx6JgJj4Jhh096-gEZi86RJ1Z95BjpMoAe5MD1L8CHsVhrPaySjFJx3HlwrB0qJwfx7LOcNZ7MWQs_rUMUXbdHJYkWwzyWVXLKzJ78BXLVhP-9NQT3aHpaFMLWLM8a6CU4nnmse-xuFBlL5OP7P5brCZMaHp-bD6Zxs5AQvc9sIWSnp9avAOeHe0q5Jv8911QM950ThzsJ6Ru6V0QQSQE3zyj621il8ZINNf8b_26YlFI9cuqZMhVx63s_7no5UF1oynXts18w-quEnse2_AP4FynUUKeZsNgr2INwgyBjf5Xs4RMyjTg0jMDWV26sPZzftg',
      }),
    [],
  );

  return (
    <div className={'vads-l-grid-container'}>
      <div className={'vads-l-row'}>
        <ReactWebChat
          activityMiddleware={activityMiddleware}
          directLine={directLine}
          store={store}
          userID="12345"
        />
      </div>
    </div>
  );
}
