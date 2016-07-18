namespace lab_exec {
  interface labExec{
    var env : any;
    var tuxlab : any;
    
    function init(user : string, labId : string, callback : (error : any, result : string) => any ) : void
    function parseTasks() : any
    function start(callback : any) : any
    function next(callback : any) : any
    function end(callback : any) : any

  }
  function labExec() : any
}
