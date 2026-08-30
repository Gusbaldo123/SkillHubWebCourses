FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

COPY WebApiDotNet/WebApiDotNet.csproj WebApiDotNet/
RUN dotnet restore WebApiDotNet/WebApiDotNet.csproj

COPY WebApiDotNet/ WebApiDotNet/

RUN dotnet publish WebApiDotNet/WebApiDotNet.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "WebApiDotNet.dll"]