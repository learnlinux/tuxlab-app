var async = require ('async');
/**
  Searches Courses based on search terms
**/
export function course_search(text : string, results_per_page : number, page_no : number, callback : any) {

  var courses = Collections.courses;

  var search_pattern = new RegExp(text,"i");
  if (results_per_page <= 0 || results_per_page > 200) results_per_page = 200;

  var search_object =
    {$and : [
      {"hidden" : false},
      {$or : [
        {"course_number" : search_pattern},
        {$where: "this.course_number.replace(/[ .-]/g,'') == '"+text+"'"},
        {"course_name" : search_pattern}
      ]}
    ]};

   var search_options =
     {limit : results_per_page,
      skip : results_per_page * (page_no - 1),
      fields : {
        "course_number" : 1,
        "course_name" : 1,
        "instructor_ids" : 1,
        "course_description" : 1
      }
     };
   async.parallel(
     {
       course_count: function(callback) {
         callback(null, courses.find(search_object).count());
       },
       course_results: function(callback) {
         callback(null, courses.find(search_object, search_options).fetch());
       }
     },
     function(err, results) {
       if(err){
          callback(err);
       }
       else{
         callback(results);
       }
   });

 }
