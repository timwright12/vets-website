export function setTopics(topic, data) {
  return {
    type: 'SET_DATA',
    data: {
      ...data,
      topic,
    },
  };
}