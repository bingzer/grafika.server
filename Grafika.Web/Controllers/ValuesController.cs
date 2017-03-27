using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Grafika.Services;
using Grafika.Web.Models;

namespace Grafika.Web.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        private readonly ITemplatedRenderingEngine<string> _renderer;

        public ValuesController(ITemplatedRenderingEngine<string> renderer)
        {
            _renderer = renderer;
        }

        // GET api/values
        [HttpGet, Produces("text/html")]
        public async Task<string> Get()
        {
            var loginModel = new LoginModel { Email = "This is username", Password = "This is password" } ;
            var str = await _renderer.Render("Emails/TestEmail", loginModel);

            //return new string[] { "value1", "value2" };
            return str;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
