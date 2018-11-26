using EmployeeServices.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace EmployeeServices.Controllers
{
    [RoutePrefix("api/students")]
    public class StudentController : ApiController
    {
        static List<Student> students = new List<Student>()
        {
            new Student() {id=1, Name="Olu" },
            new Student() {id=2, Name="Femi" },
            new Student() {id=3, Name="Tosin" }
        };

        [Route("~/api/teachers")]
        public IEnumerable<Teachers> GetTeachers()
        {
            List<Teachers> teachers = new List<Teachers>()
            {
                new Teachers() {id=1, Name="Frank"},
                new Teachers() {id=2, Name="Mike"},
            };

            return teachers;
        }

        [Route("")]
        public IEnumerable<Student> Get()
        {
            return students;
        }

        [Route("{id}")]
        public Student Get(int id)
        {
            return students.FirstOrDefault(s => s.id == id);
        }

        public Student Get(string name)
        {
            return students.FirstOrDefault(n => n.Name == name);
        }

        [Route("{id}/courses")]
        public IEnumerable<string> GetStudentCourses(int id)
        {
            if (id == 1)
            {
                return new List<string>() { "C#", "Asp.net", "Sql Server" };
            }
            else if (id == 2)
            {
                return new List<string>() { "VB.net", "Asp.net", "Sql Server" };
            }
            else if (id == 3)
            {
                return new List<string>() { "C++", "Asp.net", "Sql Server" };
            }
            else
                return null;

        }

    }

    
}
