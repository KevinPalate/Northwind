namespace NorthWind.Sales.Backend.DataContext.EFCore.Configurations;

// Crear la tabla: OrderDetails
internal class OrderDetailConfiguration : IEntityTypeConfiguration<Repositories.Entities.OrderDetail>
{
    public void Configure(EntityTypeBuilder<Repositories.Entities.OrderDetail> builder)
    {
        builder.HasKey(od => new { od.OrderId, od.ProductId });

        builder.Property(od => od.UnitPrice)
               .HasPrecision(8, 2)
               .IsRequired();

        builder.Property(od => od.Quantity)
               .IsRequired();

        // Relación con Order
        builder.HasOne(od => od.Order)
               .WithMany()
               .HasForeignKey(od => od.OrderId)
               .OnDelete(DeleteBehavior.Cascade);

        // Relación con Product
        builder.HasOne(od => od.Product)
               .WithMany()
               .HasForeignKey(od => od.ProductId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}