const devUtilityInjector = (req, res, next) => {
  if (res.locals.isDevMode) {
    res.locals.devModeMsg =
      '<p class="dev-mode-msg">Warning: Dev Mode Enabled</p>';

    // console.log("socket creation");
    res.locals.scripts.push(`
      <script>
        const ws = new WebSocket('ws://localhost:${parseInt(res.locals.port) + 1}');
        ws.onclose = () => { setTimeout(() => location.reload(), 2000); };
      </script>`
    );

    res.locals.styles.push(`
      <style>
        .dev-mode-msg {
        color: var(--secondary-text-color);
        font-size: 80px;    
        }
      </style>`
    );
  }
  next();
};

export default devUtilityInjector;
