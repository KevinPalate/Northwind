//using System.Reflection;

namespace NorthWind.Sales.Backend.DataContext.EFCore.DataContexts;

internal class NorthWindContext: DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        //optionsBuilder.UseSqlServer("Server=pc07; DataBase=NorthWindDB; User=sa; Password=sa;");
        optionsBuilder.UseSqlServer("Server=KHEVIN\\SQLEXPRESS; DataBase=NorthWindDB; Integrated Security=True; Trusted_Connection=True; Encrypt=false");
        //base.OnConfiguring(optionsBuilder);
    }

    public DbSet<Customer> Customers { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Repositories.Entities.OrderDetail> OrderDetails { get; set; }

    // Permite a las herramientas del EntityFramework Core aplicar la configuración de la entidades
    // es decir migrar las clases en tablas
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        // Ignorar la propiedad Value Object para EF Core
        modelBuilder.Entity<Order>()
            .Ignore(o => o.Details);
        //base.OnModelCreating(modelBuilder);
    }
}
