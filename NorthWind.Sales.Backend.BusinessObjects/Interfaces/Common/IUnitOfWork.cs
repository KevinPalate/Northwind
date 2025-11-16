namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Common;

/// <summary>
/// Este patrón de software permite:
/// 1) Confirmar los cambios (INSERT, UPDATE, DELETE) en la fuente
/// de datos (DB relacional, No SQL, Json, texto, etc.) lo que garantiza una 
/// TRANSACCIÓN COMPLETA, sin pérdida de datos, es decir de forma atomica.
/// 2) También permite resolver conflictos de concurrencia.
/// </summary>
public interface IUnitOfWork
{
    // El método regresa un Task que permite que la implementación pueda ser: sincrónica o asincrónica.
    Task SaveChanges();
}
