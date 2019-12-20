const NodeCache = require("node-cache");
const axios = require('axios');
const readline = require('readline-sync');
const url = "http://saral.navgurukul.org/api/courses";
let url_id = [], user, content;

const fun1 = async (resp) => {
    const availableCourses = resp.data.availableCourses
    for (index = 0; index < availableCourses.length; index++) {
        console.log(index + 1, availableCourses[index].name)
        url_id.push(availableCourses[index].id)

    };
};

const fun2 = async (user) => {
    let course_url = `http://saral.navgurukul.org/api/courses/${url_id[user - 1]}/exercises`
    const courses = axios.get(course_url).then((response) => {
        var exercise_data = response.data.data
        return exercise_data
    });
    return courses
};

const func3 = async (courses) => {
    const slug_list = []
    // console.log(courses)
    for (index = 0; index < courses.length; index++) {
        console.log(index + 1, courses[index].name)
        slug_list.push(courses[index].slug)
        for (childIndex = 0; childIndex < courses[index].childExercises.length; childIndex++) {
            slug_list.push(courses[index].childExercises[childIndex].slug)
            console.log("   ", childIndex+1, courses[index].childExercises[childIndex].name)
        };
    };
    return slug_list
};

const fun4 = async (slug) => {
    const content_url = "http://saral.navgurukul.org/api/courses/75/exercise/getBySlug?slug=" + slug
    let response = await axios.get(content_url)
    console.log(response.data.content)
    content = response.data.content
    return content
};

const response = axios.get(url);
response.then(fun1).then(() => {
    user = readline.question("Select one course - ");
    return user;
}).then(fun2).then(func3).then((slug_list) => {
    const user_input = readline.question("Select the exercise of your choosen course - ");
    const slug = slug_list[user_input - 1];
    return slug;
}).then(fun4).then(async () => {
    while(true){
        const choice = readline.question("Press next(n/N) / previous(p/P) / up(u/U) / break(anything can type) - ");
        if (choice === "u" || choice === 'U') {
            await response.then(fun1);
        }
        else if (choice === "n" || choice === 'N'){
            await fun2(user + 1).then(func3).then((slug_list) => {
                const user_input = readline.question("which exercise content do you want:- ");
                const content = slug_list[user_input - 1];
                return content;
            }).then(fun4);
        }
        else if(choice === "p" || choice === 'P'){
            await fun2(user - 1).then(func3).then((slug_list) => {
                const user_input = readline.question("which exercise content do you want:- ");
                const content = slug_list[user_input - 1]
                return content;
            }).then(fun4);
        }
        else{
            return console.log("wrong input."); 
        };
        
    };
});