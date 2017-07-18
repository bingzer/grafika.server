namespace Grafika.Services.AnimationSeries
{
    class SeriesValidator : EntityValidator<Grafika.Animations.Series>, ISeriesValidator
    {
        public SeriesValidator(IEntityIdValidator entityIdValidator) 
            : base(entityIdValidator)
        {
        }

        public override void Sanitize(Grafika.Animations.Series entity, IUser caller = null)
        {
            // TODO: get all the animations
            // and make sure they're sanitize...
            
        }
    }
}
