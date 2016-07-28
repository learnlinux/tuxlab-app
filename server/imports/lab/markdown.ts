export function get_markdown(labfile : string) : Array<any> {
  var outer_filter = /\/\*( |\n)*?@(.*?)( |\n)((.|\n)*?)\*\//gm;
  var match = labfile.match(outer_filter);
  var output = match.map(function(task_data, index, arr) {
    var inner_filter = /\/\*( |\n)*?@(.*?)( |\n)((.|\n)*?)\*\//gm;
    var filtered_data = inner_filter.exec(task_data);
    var task_name = filtered_data[2];
    var task_md = filtered_data[4];
    return {
      _id : (index + 1).toString(),
      name : task_name,
      md : task_md
    }
  });
  return output;
}
