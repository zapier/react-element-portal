let _id = 0;

const uniqueId = () => {
  _id++;
  return `_${_id}`;
};

export default uniqueId;
