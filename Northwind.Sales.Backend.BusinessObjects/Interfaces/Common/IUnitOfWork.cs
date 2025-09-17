namespace Northwind.Sales.Backend.BusinessObjects.Interfaces.Common;
/// <summary>
/// Este patron de software permite:
/// 1) Confirmar los cambios (INSERT, UPDATE, DELETE) en la fuentes de datos
/// (DB Relacional, NO SQL, Json, texto, etc) lo que garantiza una TRANSACCION COMPLETA,
/// sin perdida de datos, es decir de forma atomica.
/// 2) Tambien permite resolver conflictos de concurrencia.
/// </summary>
public interface IUnitOfWork
{
    //El metodo regresa un Task que permite que la implementacion pueda ser: sicronica o asincronica
    Task SaveChange();
}
