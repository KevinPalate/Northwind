namespace NorthWind.Sales.Backend.DataContext.EFCore.DataContexts;

internal class NorthWindSalesContext(IOptions<DBOptions> dbOptions) : DbContext 
{
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Repositories.Entities.OrderDetail> OrderDetails { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        //base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlServer(dbOptions.Value.ConnectionString);
    }

    // Permite a las herramientas de Entity Framework Core aplicar la configuración de las entidades.
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Ignorar la propiedad Value Object para EF Core
        modelBuilder.Entity<Order>()
            .Ignore(o => o.Details);
    }
}
