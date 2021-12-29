const ping = async (ctx) => {
  ctx.body = {
    msg: 'pong',
    time: new Date().getTime()
  };
};

export { ping };
