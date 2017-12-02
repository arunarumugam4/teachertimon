
# Teacher Timon

>> online realtime test conducting platform




### FIRST CLONE THE REPO USING THIS COMMAND

>> https://github.com/coolarun/teachertimon.git

===================================

### CHANGE MONGODB URL

>> go to the config folder there you have database.js file. open that file
in that file change the dbUrl to your mongodb url

===================================

### THEN PERFOM FOLLOWING COMMAND STEP BY STEP(ON TERMINAL)

>> npm install 

>> node server.js

===================================

### THAT'S IT YOUR APP IS NOW RUNNING ON THE PORT 3000

>> go to - http://localhost:3000
  now you can see the running app

===================================

### IMPORTANT API END POINTS

```
1. api/signup (POST)
end point for  sign up 
body-parameters: userName, email, password

```

```
2. api/login (POST)
end point for login  
body-parameters : email, password
```

```
3. api/logout (GET)
end point for logout
```

```
4. api/createtest (POST)
use to create new test
body-parameter : testTitle (value:title fo the new test)
```

``` 
5. api/addquestion/:testId(Put)
to add new questions to the test
body-parameter : question (value: question)
                 options (value: four option for that question)
                 answer (value: correct answer of that question)

```

```
6. api/deletequestion/:questionId (delete)
end point for delete the  question

```

```
7. api/deletetest/:testId (delete)
end point for delete the test

```

```
8. api/updatetest/:testId (PUT)
end point for update the test title



```

```
9. api/updatequestion/:questionId (PUT)
end point for update the question fields


```

```
10. api/startdateandtime/:testId (PUT)
end point for change test start date and start time
 body-parameter : startDate (value: date)
                  startTime (value: time)


```


```
11. api/statuschange/:testId (PUT)
end point for change the status of the test
 body-parameter : status (value:open or close)
                 


```

```
12. api/statusbasedquestion/:status/:skip (GET)
skip is used to skip the data you recieve (must be an integer)
status (value: "open" or "closed");
end point for get all the questions based on the status


```

```
13. api/livetest(GET)
end point for get all status open tests


```

```
14. api/alltest (GET)
end point for get all user created tests



```





===================================
