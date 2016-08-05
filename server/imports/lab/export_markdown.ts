export function markdown_editor(labfile : string, markdown : any) {
  var markdown_arr = Object.keys(markdown);
	   
  var mapping = markdown_arr.map(function(task_name) {
    var task_md = markdown[task_name];
    var md_finder = new RegExp("\/\\*( |\n)*?@(" + task_name.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ")( |\n)((.|\n)*?)\\*\/","gm");
    return [labfile.match(md_finder)[0], "/*@" + task_name + "\n" + task_md + "*/"];
  });
  var result = labfile;
  mapping.forEach(function(arr) { result = result.replace(arr[0],arr[1]);});
  return result;
};

