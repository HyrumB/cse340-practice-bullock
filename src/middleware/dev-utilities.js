
const devUtilityInjector = (req, res, next) => {
    if (res.locals.isDevMode){
        res.locals.devModeMsg = '<p class="dev-mode-msg">Warning: Development Mode Enabled</p>';
        
        res.locals.scripts.push(
              ` <script>
                const ws = new WebSocket('ws://localhost:${parseInt(res.locals.port) + 1}');
                ws.onclose = () => {
                  setTimeout(() => location.reload(), 2000);
                };
              </script>`);
    
    }
    next();
}
export default devUtilityInjector;