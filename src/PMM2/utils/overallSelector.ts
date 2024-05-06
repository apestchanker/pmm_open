const overallSelector = (status: string) => {
  switch (status) {
    case 'happy':
      return 'Happy and on track';
    case 'challenging':
      return 'Challenging to progress';
    case 'hold':
      return 'Program on hold';
    default:
      return 'No phase';
  }
};

export default overallSelector;
