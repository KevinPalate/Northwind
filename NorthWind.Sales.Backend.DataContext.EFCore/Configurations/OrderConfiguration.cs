namespace NorthWind.Sales.Backend.DataContext.EFCore.Configurations;

// Crear la tabla: Orders
internal class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.CustomerId)
               .HasMaxLength(10)
               .IsRequired();

        builder.Property(o => o.ShipAddress)
               .HasMaxLength(100);

        builder.Property(o => o.ShipCity)
               .HasMaxLength(50);

        builder.Property(o => o.ShipCountry)
               .HasMaxLength(50);

        builder.Property(o => o.ShipPostalCode)
               .HasMaxLength(10);

        // Relación con Customer
        builder.HasOne(o => o.Customer)
               .WithMany()
               .HasForeignKey(o => o.CustomerId)
               .OnDelete(DeleteBehavior.Restrict);
    }

}
