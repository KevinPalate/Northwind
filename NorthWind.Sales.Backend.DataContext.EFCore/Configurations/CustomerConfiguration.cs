namespace NorthWind.Sales.Backend.DataContext.EFCore.Configurations;
// Crear la tabla: Customer
internal class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.HasKey(c => c.CustomerId);
        builder.Property(c => c.CustomerId).HasMaxLength(10).IsRequired();
        builder.Property(c => c.FirstName).HasMaxLength(50).IsRequired();
        builder.Property(c => c.LastName).HasMaxLength(50).IsRequired();
        builder.Property(c => c.Address).HasMaxLength(100);
        builder.Property(c => c.PhoneNumber).HasMaxLength(20);
        builder.Property(c => c.Email).HasMaxLength(100);
    }
}
