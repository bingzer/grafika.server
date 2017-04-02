using Grafika.Emails;
using Grafika.Services.Models;
using System;
using System.Threading.Tasks;

namespace Grafika.Services.Emails
{
    public class TemplatedEmailData<TModel> : EmailData
    {
        private readonly TModel _model;
        private readonly string _templateName;
        private readonly ITemplatedRenderingEngine<string> _engine;

        public TemplatedEmailData(ITemplatedRenderingEngine<string> engine, String templateName, TModel model)
        {
            _model = model;
            _templateName = templateName;
            _engine = engine;
        }

        public override Task<string> GetContent(string type = ContentTypes.Html)
        {
            switch (type)
            {
                case ContentTypes.Html:
                case ContentTypes.Text:
                    break;
                default:
                    throw new NotSupportedException("type = " + type);
            }

            return _engine.Render(_templateName, _model, type);
        }
    }
}
