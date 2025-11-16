namespace NorthWind.Sales.Backend.DataContext.EFCore.Configurations;
// Crear la tabla: Products
internal class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.ProductId);
        builder.Property(p => p.Name).HasMaxLength(100).IsRequired();
        builder.Property(p => p.UnitPrice).HasPrecision(8, 2).IsRequired();
        builder.Property(p => p.Stock).IsRequired();
    }
}
